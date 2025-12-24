import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    question: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestions', () => {
    it('should return questions with default locale (en)', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'What is your name?' }],
          enumValues: [],
        },
        {
          id: 2,
          parentId: null,
          order: 2,
          content: 'number',
          unit: 'years',
          translations: [{ value: 'How old are you?' }],
          enumValues: [],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(prismaService.question.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
        include: {
          translations: {
            where: { locale: LocaleCode.en },
          },
          enumValues: {
            orderBy: { order: 'asc' },
            include: {
              translations: {
                where: { locale: LocaleCode.en },
              },
            },
          },
        },
      });

      expect(result).toEqual([
        {
          id: 1,
          label: 'What is your name?',
          content: 'text',
          order: 1,
          unit: null,
          enumValues: [],
          children: [],
        },
        {
          id: 2,
          label: 'How old are you?',
          content: 'number',
          order: 2,
          unit: 'years',
          enumValues: [],
          children: [],
        },
      ]);
    });

    it('should return questions with specified locale (fr)', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Quel est votre nom ?' }],
          enumValues: [],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions(LocaleCode.fr);

      expect(prismaService.question.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
        include: {
          translations: {
            where: { locale: LocaleCode.fr },
          },
          enumValues: {
            orderBy: { order: 'asc' },
            include: {
              translations: {
                where: { locale: LocaleCode.fr },
              },
            },
          },
        },
      });

      expect(result[0].label).toBe('Quel est votre nom ?');
    });

    it('should return questions with enum values', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'enum',
          unit: null,
          translations: [{ value: 'Choose a color' }],
          enumValues: [
            {
              id: 1,
              value: 'red',
              order: 1,
              translations: [{ value: 'Red' }],
            },
            {
              id: 2,
              value: 'blue',
              order: 2,
              translations: [{ value: 'Blue' }],
            },
          ],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(result[0].enumValues).toEqual([
        { id: 1, value: 'red', order: 1, label: 'Red' },
        { id: 2, value: 'blue', order: 2, label: 'Blue' },
      ]);
    });

    it('should build hierarchical tree structure with children', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Parent Question' }],
          enumValues: [],
        },
        {
          id: 2,
          parentId: 1,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Child Question 1' }],
          enumValues: [],
        },
        {
          id: 3,
          parentId: 1,
          order: 2,
          content: 'text',
          unit: null,
          translations: [{ value: 'Child Question 2' }],
          enumValues: [],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children[0].id).toBe(2);
      expect(result[0].children[1].id).toBe(3);
    });

    it('should handle missing translations with fallback', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'text',
          unit: null,
          translations: [],
          enumValues: [],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(result[0].label).toBe('Question 1');
    });

    it('should handle missing enum value translations with fallback', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'enum',
          unit: null,
          translations: [{ value: 'Choose' }],
          enumValues: [
            {
              id: 1,
              value: 'option1',
              order: 1,
              translations: [],
            },
          ],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(result[0].enumValues[0].label).toBe('option1');
    });

    it('should return empty array when no questions exist', async () => {
      mockPrismaService.question.findMany.mockResolvedValue([]);

      const result = await service.getQuestions();

      expect(result).toEqual([]);
    });

    it('should handle nested children (multi-level hierarchy)', async () => {
      const mockQuestions = [
        {
          id: 1,
          parentId: null,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Level 1' }],
          enumValues: [],
        },
        {
          id: 2,
          parentId: 1,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Level 2' }],
          enumValues: [],
        },
        {
          id: 3,
          parentId: 2,
          order: 1,
          content: 'text',
          unit: null,
          translations: [{ value: 'Level 3' }],
          enumValues: [],
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await service.getQuestions();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].id).toBe(2);
      expect(result[0].children[0].children).toHaveLength(1);
      expect(result[0].children[0].children[0].id).toBe(3);
    });
  });
});
