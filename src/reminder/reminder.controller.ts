import { Controller, Post, Body, NotFoundException, HttpStatus, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { AuthGuard } from 'src/auth/autorisation/auth.guard';
import { HasAdminOrUserGuard } from 'src/auth/autorisation/has-admin-user.guard';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @UseGuards(AuthGuard, HasAdminOrUserGuard)
  @Post()
  async createReminders(@Body() createReminderDtoArray: CreateReminderDto[]): Promise<Reminder[]> {
      return await this.reminderService.createReminders(createReminderDtoArray);
  }

  @UseGuards(AuthGuard, HasAdminOrUserGuard)
  @Put(':taskId')
  async updateReminders(@Param('taskId') taskId: number, @Body() updateReminderDto: Reminder[]): Promise<void> {
    try {
      await this.reminderService.updateReminders(taskId, updateReminderDto);
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
  

  @Delete(':id')
  async deleteReminderById(@Param('id') reminderId: number): Promise<number> {
    
      await this.reminderService.deleteReminderById(reminderId);
      return reminderId;
  }
}
