import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpAdapter } from './../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {

  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await firstValueFrom(
        this.httpService.get<T>(url)
      );
      return response.data;
    } catch (error) {
      // Aquí podrías usar Logger para registrar el error
      throw new Error('This is an error - Check logs');
    }
  }
}
