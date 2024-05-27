import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class EditTaskDto {
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
