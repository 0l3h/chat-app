import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

interface FileUpload {
  fileName: string;
  fileData: ArrayBuffer;
}

@WebSocketGateway(7000, { cors: '*' })
export class ChatGateway {
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  server;

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    {
      authorId,
      receiverId,
      message,
      files = [],
    }: {
      authorId: number;
      receiverId: number;
      message: string;
      files?: FileUpload[];
    },
  ) {
    const data: Prisma.MessageCreateInput = {
      text: message,
      createdAt: new Date(Date.now()),
      editedAt: new Date(Date.now()),
      author: {
        connect: {
          id: authorId,
        },
      },
      receiver: {
        connect: {
          id: receiverId,
        },
      },
    };

    const newMessage = await this.prismaService.message.create({
      data,
    });

    function arrayBufferToString(buffer: ArrayBuffer): string {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(buffer);
    }

    if (files.length > 0) {
      const attachmentPromises = files.map(async (file) => {
        const fileData: Prisma.AttachmentCreateInput = {
          data: arrayBufferToString(file.fileData),
          name: file.fileName,
          message: {
            connect: {
              id: newMessage.id,
            },
          },
          author: {
            connect: {
              id: authorId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        };

        return this.prismaService.attachment.create({
          data: fileData,
        });
      });

      Promise.all(attachmentPromises);
    }
    const createdMessage = await this.prismaService.message.findUnique({
      where: {
        id: newMessage.id,
      },
      include: {
        attachment: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log(createdMessage);
    this.server.emit('message', createdMessage);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('get-messages')
  async handleGetMessages(
    @MessageBody()
    { authorId, receiverId }: { authorId: number; receiverId: number },
  ): Promise<void> {
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          {
            receiverId,
            authorId,
          },
          {
            receiverId: authorId,
            authorId: receiverId,
          },
        ],
      },
      orderBy: { createdAt: Prisma.SortOrder.asc },
      include: {
        attachment: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    this.server.emit('get-messages', messages);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('get-contacts')
  async handleGetContacts(@MessageBody() { userId }: { userId: number }) {
    const chatsAsUser = await this.prismaService.chat.findMany({
      where: { userId },
      include: {
        contact: true,
      },
    });

    const chatsAsContact = await this.prismaService.chat.findMany({
      where: { contactId: userId },
      include: {
        user: true,
      },
    });

    const contacts = [
      ...chatsAsUser.map((chat) => chat.contact),
      ...chatsAsContact.map((chat) => chat.user),
    ];

    this.server.emit('get-contacts', contacts);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('add-contact')
  async handleAddContact(
    @MessageBody()
    {
      userId,
      contactPhoneNumber,
    }: {
      userId: number;
      contactPhoneNumber: string;
    },
  ) {
    console.log(userId, contactPhoneNumber);
    const { id: contactId } = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: contactPhoneNumber,
      },
      select: {
        id: true,
      },
    });
    const contact = await this.prismaService.chat.create({
      data: {
        userId,
        contactId,
      },
    });
    console.log(contact);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('delete-message')
  async handleDeleteMessage(
    @MessageBody() { messageId }: { messageId: number },
  ) {
    console.log(messageId);
    await this.prismaService.message.delete({
      where: {
        id: messageId,
      },
    });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('edit-message')
  async handleEditMessage(
    @MessageBody()
    { messageId, newText }: { messageId: number; newText: string },
  ) {
    console.log(messageId, newText);
    const updatedMessage = await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: {
        text: newText,
      },
    });
    console.log(updatedMessage);
  }
}
