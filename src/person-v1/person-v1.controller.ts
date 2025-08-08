import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PersonV1Service } from './person-v1.service';
import { CreatePersonV1Dto } from '../dto/create-person-v1.dto';
import { UpdatePersonV1Dto } from '../dto/update-person-v1.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Person } from '../entities/person.entity';

@ApiTags('Pessoas V1')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/pessoas')
export class PersonV1Controller {
  constructor(private readonly personService: PersonV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova pessoa' })
  @ApiResponse({
    status: 201,
    description: 'Pessoa cadastrada com sucesso',
    type: Person,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CPF já cadastrado' })
  create(@Body() createPersonDto: CreatePersonV1Dto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pessoas com paginação e busca' })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Termo de busca' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pessoas',
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.personService.findAll(+page, +limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pessoa por ID' })
  @ApiParam({ name: 'id', description: 'ID da pessoa' })
  @ApiResponse({
    status: 200,
    description: 'Pessoa encontrada',
    type: Person,
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da pessoa' })
  @ApiParam({ name: 'id', description: 'ID da pessoa' })
  @ApiResponse({
    status: 200,
    description: 'Pessoa atualizada com sucesso',
    type: Person,
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  @ApiResponse({ status: 409, description: 'CPF já cadastrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonV1Dto,
  ) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pessoa' })
  @ApiParam({ name: 'id', description: 'ID da pessoa' })
  @ApiResponse({ status: 200, description: 'Pessoa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personService.remove(id);
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Buscar pessoa por CPF' })
  @ApiParam({ name: 'cpf', description: 'CPF da pessoa' })
  @ApiResponse({
    status: 200,
    description: 'Pessoa encontrada',
    type: Person,
  })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  findByCpf(@Param('cpf') cpf: string) {
    return this.personService.findByCpf(cpf);
  }
}
