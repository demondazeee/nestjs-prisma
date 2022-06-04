import { Test, TestingModule } from '@nestjs/testing';
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
      prisma.items.findMany = jest.fn().mockResolvedValue([
        {id: 1, title: 'apple'},
        {id: 2, title: 'orange'}
      ])
      const result = await service.findAll()

      expect(result.length).toBeGreaterThan(1)
      expect(result).toBeTruthy()
    })
    
  })

  afterEach(() =>{
    jest.resetAllMocks()
    jest.clearAllMocks()
  })
});
