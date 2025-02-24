import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePrivacyDto } from './dto/create-privacy.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrivaciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPrivacyDto: CreatePrivacyDto) {
    try {
      const privacy = await this.prisma.privacy.create({
        data: createPrivacyDto,
      });
      return { success: true, data: privacy };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  }

  async findAll(page: number, pageSize: number) {
    try {
      const total = await this.prisma.privacy.count();
      const privacies = await this.prisma.privacy.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { 
        success: true, 
        data: privacies,
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
      const data = await this.prisma.privacy.findUnique({
        where: { id },
      });
  
      if (!data) {
        return {
          success: false,
          message: `Privacy with ID ${id} not found`,
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

  async update(id: number, updatePrivacyDto: UpdatePrivacyDto) {
    try {
      const data = await this.prisma.privacy.update({
        where: { id },
        data: updatePrivacyDto,
      });
  
      return {
        success: true,
        data,
        message: `Privacy with ID ${id} updated successfully`,
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
      const data = await this.prisma.privacy.delete({
        where: { id },
      });
  
      return {
        success: true,
        data,
        message: `Privacy with ID ${id} deleted successfully`,
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
