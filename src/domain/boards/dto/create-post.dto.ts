
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString,  } from "class-validator";
import { format } from "date-fns";
import { Column } from "typeorm";

export class CreateBoardPostDto {

    @IsNumber()
    @Column('board_id')
    readonly boardId: number;

    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly contents: string;

    @IsString()
    readonly writer: string;

    @IsString()
    readonly passwd: string;
    
    @IsOptional()
    @Transform(() => format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
    readonly registDate: string = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}