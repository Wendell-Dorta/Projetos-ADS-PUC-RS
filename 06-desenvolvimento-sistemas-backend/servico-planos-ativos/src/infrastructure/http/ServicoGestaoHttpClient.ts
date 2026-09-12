import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IServicoGestaoClient } from '../../domain/services/IServicoGestaoClient';

@Injectable()
export class ServicoGestaoHttpClient implements IServicoGestaoClient {
  private readonly logger = new Logger(ServicoGestaoHttpClient.name);
  private readonly gestaoUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.gestaoUrl =
      this.configService.get<string>('SERVICO_GESTAO_URL') || 'http://localhost:3001';
  }

  async consultarValidadeAssinatura(codAss: number): Promise<boolean> {
    this.logger.log(
      `[HTTP -> ServicoGestao] Consultando validade da assinatura ${codAss} em ${this.gestaoUrl}...`,
    );

    // Tentativa 1: Endpoint direto de verificação
    try {
      const response = await axios.get(`${this.gestaoUrl}/gestao/assinaturas/valida/${codAss}`, {
        timeout: 3000,
      });
      if (response.data && typeof response.data.ativa === 'boolean') {
        return response.data.ativa;
      }
    } catch (err: any) {
      this.logger.warn(
        `[ServicoGestaoClient] Falha no endpoint /valida/${codAss} (${err?.message}). Tentando fallback...`,
      );
    }

    // Tentativa 2: Fallback consultando a lista de assinaturas ATIVOS
    try {
      const response = await axios.get(`${this.gestaoUrl}/gerenciaplanos/assinaturas/ATIVOS`, {
        timeout: 3000,
      });
      if (Array.isArray(response.data)) {
        const encontrada = response.data.some(
          (ass: any) => ass.codigo === codAss || ass.codAss === codAss,
        );
        return encontrada;
      }
    } catch (err: any) {
      this.logger.error(
        `[ServicoGestaoClient] Erro ao consultar ServicoGestao: ${err?.message}`,
      );
    }

    // Caso não seja possível contatar o ServicoGestao, retorna falso por padrão (fail-closed)
    return false;
  }
}
