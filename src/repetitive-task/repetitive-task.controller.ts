import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RepetitiveTaskService } from './repetitive-task.service';
import { RepetitiveTaskDto } from './dto/repetitive-task.dto';
import { AuthGuard } from 'src/auth/autorisation/auth.guard';
import { HasAdminGuard } from 'src/auth/autorisation/has-admin.guard';

@Controller('repetitive-task')
export class RepetitiveTaskController {
  constructor(private readonly repetitiveTaskService: RepetitiveTaskService) {}


  @UseGuards(AuthGuard,HasAdminGuard)
  @Post()
  async create(@Body() repetitiveTaskDto: RepetitiveTaskDto) {
    return await this.repetitiveTaskService.create(repetitiveTaskDto);
  }

  @UseGuards(AuthGuard,HasAdminGuard)
  @Get()
  async findAll() {
    return await this.repetitiveTaskService.findAll();
  }
  @UseGuards(AuthGuard,HasAdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.repetitiveTaskService.findOne(+id);
  }

  @UseGuards(AuthGuard,HasAdminGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() repetitiveTaskDto: RepetitiveTaskDto) {
    return await this.repetitiveTaskService.update(+id, repetitiveTaskDto);
  }

  @UseGuards(AuthGuard,HasAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.repetitiveTaskService.remove(+id);
  }
  @UseGuards(AuthGuard,HasAdminGuard)
  @Delete('activate/:id')
  async activate(@Param('id') id: number) {
    return await this.repetitiveTaskService.activate(+id);
  }
}
