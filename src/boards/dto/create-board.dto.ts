
import { IsOptional, IsString } from "class-validator";

export class CreateBoardDto {

    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly desc: string;
}