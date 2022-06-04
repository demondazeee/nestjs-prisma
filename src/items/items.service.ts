import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService
    ) {}


  async create(data: Prisma.ItemsCreateInput) {
    try {
      const result = await this.prisma.items.create({
        data
      })

      return result
    } catch(e){
      throw new InternalServerErrorException(e)
    }
  }

  async findAll() {
    try {
      const results = await this.prisma.items.findMany()
      return results
    } catch(e){ 
      throw new InternalServerErrorException(e)
    };
  }

  async findOne(id: Prisma.ItemsWhereUniqueInput) {
    try {
      const result =  await this.prisma.items.findUnique({
        where: id
      });
      if(!result) throw new NotFoundException('No Existing Items')
      return result
    } catch(e){
      throw new InternalServerErrorException(e)
    }
  }

  async update(id: Prisma.ItemsWhereUniqueInput, updateItemDto: Prisma.ItemsUpdateInput) {
    await this.findOne(id)
   try {

    const result = await this.prisma.items.update({
      where: id,
      data: updateItemDto
    });

    return result
   } catch(e){
     throw new InternalServerErrorException(e)
   }
  }

  async remove(id: Prisma.ItemsWhereUniqueInput) {
    await this.findOne(id)
    try {
      const result = await this.prisma.items.delete({
        where: id
      })

      return result
    }catch(e){
      throw new InternalServerErrorException(e)
    }
  }
}
