import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  senderAddress?: string;

  @IsString()
  @IsOptional()
  receiverAddress?: string;

  @IsString()
  @IsOptional()
  blockNumber?: string;

  @IsString()
  @IsOptional()
  blockHash?: string;

  @IsString()
  @IsOptional()
  transactionHash?: string;

  @IsString()
  @IsOptional()
  gasPrice?: string;

  @IsString()
  @IsOptional()
  value?: string;
}
