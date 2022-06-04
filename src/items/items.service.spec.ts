import { Test, TestingModule } from '@nestjs/testing';
import { Items } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, PrismaService],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prisma = module.get<PrismaService>(PrismaService)
  });

  describe('findAll', () =>{
    
    it('should be defined', () =>{

      expect(prisma.items.findMany).toBeDefined()
    })

    it('should be called', async () =>{
      prisma.items.findMany = jest.fn()

      await service.findAll()
      expect(prisma.items.findMany).toBeCalled()
    })
    
    it('should return values', async () =>{
      const items: Items[] = [{id: 1, title: 'apple'},
      {id: 2, title: 'orange'}]

      prisma.items.findMany = jest.fn().mockResolvedValue(items)
      const result = await service.findAll()

      expect(result.length).toBeGreaterThan(1)
      expect(result).toBeTruthy()
      expect(result).toEqual(items)
    })
    
  })

  describe('findOne', () =>{

    it('should be define', () => {
      prisma.items.findUnique = jest.fn()

      expect(prisma.items.findUnique).toBeDefined()
    })

    it('should be called', async () => {
      prisma.items.findUnique = jest.fn().mockResolvedValue({id: 1, title: 'apple'})

      await service.findOne({id: 1})
      expect(prisma.items.findUnique).toBeCalled()
    })

    it('should return values', async () => {
      const items = [
        {id: 1, title: 'apple'},
        {id: 2, title: 'orange'},
        {id: 3, title: 'banana'}
      ]
      for (let i = 0; i < items.length; i++){
        prisma.items.findUnique = jest.fn().mockImplementation((data) => {
          if (items[i]['id'] === data.where.id){
            return items[i]
          }
        })

        const result = await service.findOne({id: 1 + i})
        
        expect(prisma.items.findUnique).toBeCalledWith({
          where: {
            id: 1 + i
          }
        })
        expect(result).toEqual(items[i])
      }
      
    })

  })

  afterEach(() =>{
    jest.resetAllMocks()
    jest.clearAllMocks()
  })
});
