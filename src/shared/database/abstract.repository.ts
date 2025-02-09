import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly entityName: string,
    public readonly originalError?: any,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export abstract class AbstractRepository<T extends Document> {
  protected readonly logger: Logger;

  constructor(
    protected readonly model: Model<T>,
    private readonly entityName: string,
  ) {
    this.logger = new Logger(entityName + 'Repository');
  }

  protected handleError(error: any, operation: string): never {
    const dbError = new DatabaseError(
      `Error during ${operation} operation`,
      operation,
      this.entityName,
      error,
    );

    this.logger.error(dbError);

    if (error.name === 'ValidationError') {
      throw new BadRequestException({
        message: 'Validation error',
        details: error.errors,
      });
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new BadRequestException({
        message: 'Duplicate key error',
        details: error.keyValue,
      });
    }

    throw new InternalServerErrorException('An unexpected error occurred');
  }

  async create(
    data: Partial<T>,
    // Omit<
    //   T,
    //   '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    // >
    session?: ClientSession,
  ): Promise<T> {
    try {
      const entity = new this.model(data);
      const created = await entity.save({ session });
      return created;
    } catch (error) {
      this.handleError(error, 'create');
    }
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const entity = await this.model.findOne(
        { ...filterQuery, isDeleted: { $ne: true } },
        projection,
      );

      if (!entity) {
        throw new NotFoundException(`${this.entityName} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleError(error, 'findOne');
    }
  }

  async findAll(
    filterQuery: FilterQuery<T> = {},
    projection?: Record<string, unknown>,
  ): Promise<T[]> {
    try {
      return await this.model.find(
        { ...filterQuery, isDeleted: { $ne: true } },
        projection,
      );
    } catch (error) {
      this.handleError(error, 'findAll');
    }
  }

  async update(
    filterQuery: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T> {
    try {
      const entity = await this.model.findOneAndUpdate(
        { ...filterQuery, isDeleted: { $ne: true } },
        updateData,
        { new: true, session },
      );

      if (!entity) {
        throw new NotFoundException(`${this.entityName} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleError(error, 'update');
    }
  }

  async softDelete(
    filterQuery: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<boolean> {
    try {
      const result = await this.model.updateOne(
        filterQuery,
        { isDeleted: true },
        { session },
      );
      return result.modifiedCount > 0;
    } catch (error) {
      this.handleError(error, 'softDelete');
    }
  }

  async hardDelete(
    filterQuery: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<boolean> {
    try {
      const result = await this.model.deleteOne(filterQuery, { session });
      return result.deletedCount > 0;
    } catch (error) {
      this.handleError(error, 'hardDelete');
    }
  }

  async transaction<TResult>(
    callback: (session: ClientSession) => Promise<TResult>,
  ): Promise<TResult> {
    const session = await this.model.db.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      this.handleError(error, 'transaction');
    } finally {
      await session.endSession();
    }
  }

  async exists(filterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      return (
        (await this.model.exists({
          ...filterQuery,
          isDeleted: { $ne: true },
        })) !== null
      );
    } catch (error) {
      this.handleError(error, 'exists');
    }
  }

  async count(filterQuery: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments({
        ...filterQuery,
        isDeleted: { $ne: true },
      });
    } catch (error) {
      this.handleError(error, 'count');
    }
  }
}
