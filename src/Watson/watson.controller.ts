import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WatsonService } from './watson.service';
import { Response } from 'express';
import { ConfigService } from '../Config/Config.service';

@Controller('Watson')
@ApiTags('Watson')
export class WatsonController {
  constructor(
    private readonly configService: ConfigService,
    private readonly watsonService: WatsonService,
  ) {}

  @Get('imagem/:url')
  @ApiOperation({
    summary: 'Inserir url da imagem e Pegar resposta do watson',
  })
  async getResponseWatson(
    @Param('url') urlImagem: string,
    @Res() res: Response,
  ) {
    const apiKey = `${this.configService.get('API_KEY')}`;
    const urlWatson = `${this.configService.get('URL')}`;

    const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const visualRecognition = new VisualRecognitionV3({
      version: '2018-03-19',
      authenticator: new IamAuthenticator({
        apikey: apiKey,
      }),
      serviceUrl: urlWatson,
      disableSslVerification: true,
    });

    var url = urlImagem;

    var params = {
      url: url,
    };

    visualRecognition.classify(params, function (err, response) {
      if (err) {
        res.json(err);
      } else {
        res.json(response);
      }
    });
  }
}
