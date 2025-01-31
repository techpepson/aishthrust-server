import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializeTransaction(email: string, amount: number) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo
          callback_url: `${process.env.APP_URL}/api/investments/verify-payment`,
          currency: 'NGN',
        },
        {
          headers: this.getHeaders(),
        },
      );

      if (response.data.status) {
        return response.data.data;
      }

      throw new HttpException(
        response.data.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      }
      throw new HttpException(
        'Failed to initialize payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: this.getHeaders(),
        },
      );

      if (response.data.status) {
        return response.data.data;
      }

      throw new HttpException(
        response.data.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      }
      throw new HttpException(
        'Failed to verify payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
