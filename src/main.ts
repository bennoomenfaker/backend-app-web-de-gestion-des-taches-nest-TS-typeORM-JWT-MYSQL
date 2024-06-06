import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {


    // Créer l'application NestJS une fois que la connexion est établie
    const app = await NestFactory.create(AppModule);

  // Activer CORS pour autoriser toutes les origines
   app.enableCors();
 /* app.enableCors({
        origin: '*', // Mettez ici l'URL de votre application mobile
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });*/

    await app.listen(5000);
     

}

bootstrap();
