import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { PersonV2Service } from "./person-v2.service";
import { CreatePersonV2Dto } from "../dto/create-person-v2.dto";
import { UpdatePersonV2Dto } from "../dto/update-person-v2.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Person } from "../entities/person.entity";

@ApiTags("Pessoas V2")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/v2/pessoas")
export class PersonV2Controller {
  constructor(private readonly personService: PersonV2Service) {}

  @Post()
  @ApiOperation({ summary: "Cadastrar nova pessoa (endereço obrigatório)" })
  @ApiResponse({
    status: 201,
    description: "Pessoa cadastrada com sucesso",
    type: Person,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "CPF já cadastrado" })
  create(@Body() createPersonDto: CreatePersonV2Dto) {
    return this.personService.create(createPersonDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar dados da pessoa" })
  @ApiParam({ name: "id", description: "ID da pessoa" })
  @ApiResponse({
    status: 200,
    description: "Pessoa atualizada com sucesso",
    type: Person,
  })
  @ApiResponse({ status: 404, description: "Pessoa não encontrada" })
  @ApiResponse({ status: 409, description: "CPF já cadastrado" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonV2Dto
  ) {
    return this.personService.update(id, updatePersonDto);
  }

  @Get("endereco/:endereco")
  @ApiOperation({ summary: "Buscar pessoas por endereço" })
  @ApiParam({ name: "endereco", description: "Endereço para busca" })
  @ApiResponse({
    status: 200,
    description: "Pessoas encontradas",
    type: [Person],
  })
  findByAddress(@Param("endereco") endereco: string) {
    return this.personService.findByAddress(endereco);
  }
}
