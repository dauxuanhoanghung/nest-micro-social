import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: createTagDto.name,
        userId: createTagDto.userId,
      },
    });
  }

  async findAll(page: number, pageSize: number) {
    try {
      const total = await this.prisma.tag.count();
      const data = await this.prisma.tag.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
  
      return {
        success: true,
        data,
        pagination: {
          total,
          page,
          pageSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          page,
          pageSize,
        },
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.tag.findUnique({
        where: { id },
      });
  
      if (!data) {
        return {
          success: false,
          message: `Tag with ID ${id} not found`,
          data: null,
        };
      }
  
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
  
  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      const data = await this.prisma.tag.update({
        where: { id },
        data: {
          name: updateTagDto.name,
          userId: updateTagDto.userId,
        },
      });
  
      return {
        success: true,
        data,
        message: `Tag with ID ${id} updated successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.tag.delete({
        where: { id },
      });
  
      return {
        success: true,
        data,
        message: `Tag with ID ${id} deleted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
}
