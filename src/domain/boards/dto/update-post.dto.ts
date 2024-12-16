import { PartialType } from "@nestjs/mapped-types";
import { CreateBoardPostDto } from "./create-post.dto";
export class UpdateBoardPostDto extends PartialType(CreateBoardPostDto) { }
