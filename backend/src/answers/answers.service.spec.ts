import { Test, TestingModule } from '@nestjs/testing';
import { AnswersService } from './answers.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswersDto } from './dto/create-answers.dto';

describe('AnswersService', () => {
  let service: AnswersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    answer: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAnswers', () => {
    it('should create a single answer successfully', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: 'John Doe',
        },
      ];

      const mockCreatedAnswer = {
        id: 1,
        questionId: 1,
        value: 'John Doe',
        createdAt: new Date(),
      };

      mockPrismaService.answer.create.mockResolvedValue(mockCreatedAnswer);

      const result = await service.createAnswers(createAnswersDto);

      expect(prismaService.answer.create).toHaveBeenCalledTimes(1);
      expect(prismaService.answer.create).toHaveBeenCalledWith({
        data: {
          questionId: 1,
          value: 'John Doe',
        },
      });

      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });

    it('should create multiple answers successfully', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: 'John Doe',
        },
        {
          questionId: 2,
          answer: '30',
        },
        {
          questionId: 3,
          answer: 'blue',
        },
      ];

      const mockCreatedAnswers = [
        {
          id: 1,
          questionId: 1,
          value: 'John Doe',
          createdAt: new Date(),
        },
        {
          id: 2,
          questionId: 2,
          value: '30',
          createdAt: new Date(),
        },
        {
          id: 3,
          questionId: 3,
          value: 'blue',
          createdAt: new Date(),
        },
      ];

      mockPrismaService.answer.create
        .mockResolvedValueOnce(mockCreatedAnswers[0])
        .mockResolvedValueOnce(mockCreatedAnswers[1])
        .mockResolvedValueOnce(mockCreatedAnswers[2]);

      const result = await service.createAnswers(createAnswersDto);

      expect(prismaService.answer.create).toHaveBeenCalledTimes(3);
      expect(prismaService.answer.create).toHaveBeenNthCalledWith(1, {
        data: {
          questionId: 1,
          value: 'John Doe',
        },
      });
      expect(prismaService.answer.create).toHaveBeenNthCalledWith(2, {
        data: {
          questionId: 2,
          value: '30',
        },
      });
      expect(prismaService.answer.create).toHaveBeenNthCalledWith(3, {
        data: {
          questionId: 3,
          value: 'blue',
        },
      });

      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });

    it('should handle empty answers array', async () => {
      const createAnswersDto: CreateAnswersDto[] = [];

      const result = await service.createAnswers(createAnswersDto);

      expect(prismaService.answer.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });

    it('should handle numeric answers', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: '42',
        },
      ];

      const mockCreatedAnswer = {
        id: 1,
        questionId: 1,
        value: '42',
        createdAt: new Date(),
      };

      mockPrismaService.answer.create.mockResolvedValue(mockCreatedAnswer);

      const result = await service.createAnswers(createAnswersDto);

      expect(prismaService.answer.create).toHaveBeenCalledWith({
        data: {
          questionId: 1,
          value: '42',
        },
      });

      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });

    it('should throw error when Prisma create fails', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: 'Test',
        },
      ];

      const error = new Error('Database connection failed');
      mockPrismaService.answer.create.mockRejectedValue(error);

      await expect(service.createAnswers(createAnswersDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle partial failure in batch creation', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: 'Success',
        },
        {
          questionId: 2,
          answer: 'Will fail',
        },
      ];

      const mockSuccess = {
        id: 1,
        questionId: 1,
        value: 'Success',
        createdAt: new Date(),
      };

      mockPrismaService.answer.create
        .mockResolvedValueOnce(mockSuccess)
        .mockRejectedValueOnce(new Error('Constraint violation'));

      await expect(service.createAnswers(createAnswersDto)).rejects.toThrow(
        'Constraint violation',
      );

      expect(prismaService.answer.create).toHaveBeenCalledTimes(2);
    });

    it('should handle special characters in answers', async () => {
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: "Test with 'quotes' and \"double quotes\"",
        },
      ];

      const mockCreatedAnswer = {
        id: 1,
        questionId: 1,
        value: "Test with 'quotes' and \"double quotes\"",
        createdAt: new Date(),
      };

      mockPrismaService.answer.create.mockResolvedValue(mockCreatedAnswer);

      const result = await service.createAnswers(createAnswersDto);

      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });

    it('should handle long text answers', async () => {
      const longText = 'A'.repeat(1000);
      const createAnswersDto: CreateAnswersDto[] = [
        {
          questionId: 1,
          answer: longText,
        },
      ];

      const mockCreatedAnswer = {
        id: 1,
        questionId: 1,
        value: longText,
        createdAt: new Date(),
      };

      mockPrismaService.answer.create.mockResolvedValue(mockCreatedAnswer);

      const result = await service.createAnswers(createAnswersDto);

      expect(prismaService.answer.create).toHaveBeenCalledWith({
        data: {
          questionId: 1,
          value: longText,
        },
      });

      expect(result).toEqual({
        message: 'Answers saved successfully',
      });
    });
  });
});
