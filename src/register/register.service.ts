import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { IUsers } from './../users/interfaces/users.interface';
import { MailerService } from '../shared/mailer/mailer.service';
import { HashingService } from '../shared/hashing/hashing.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly hashingService: HashingService,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<IUsers> {
    registerUserDto.password = await this.hashingService.hash(
      registerUserDto.password,
    );

    this.sendMailRegisterUser(registerUserDto);

    return this.usersService.create(registerUserDto);
  }

  private sendMailRegisterUser(user): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.name,
        },
      })
      .then((response) => {
        console.log(response);
        console.log('User Registration: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Registration: Send Mail Failed!');
      });
  }
}
