def main():
    print("--- Análise de Temperaturas Máximas Anuais (2021) ---");

    # Variáveis para armazenar os resultados
    soma_total_temperaturas = 0.0;
    contagem_meses_quentes = 0; # Meses com temperatura acima de 33°C
    # Maior temperatura e os meses em que ela ocorreu
    maior_temperatura_registrada = -float('inf');
    meses_com_maior_temperatura = [];
    # Menor temperatura e os meses em que ela ocorreu
    menor_temperatura_registrada = float('inf');
    meses_com_menor_temperatura = [];

    # Nomes dos meses para exibir ao usuário
    nomes_dos_meses = [
        "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    # Loop para coletar dados de cada mês
    for numero_do_mes in range(1, 13):
        while True:
            # Pede a temperatura e trata a entrada
            entrada_temp_str = input(
                f"Informe a temperatura máxima de {nomes_dos_meses[numero_do_mes]} "
                f"(Celsius, entre -60 e 50°C): "
            ).replace(',', '.');
            
            try:
                temperatura_do_mes = float(entrada_temp_str);
                # Valida se a temperatura está no intervalo permitido
                if -60 <= temperatura_do_mes <= 50:
                    break;
                else:
                    print("ERRO: Temperatura fora do intervalo. Deve ser entre -60 e 50°C.");
            except ValueError:
                print("ERRO: Entrada inválida. Digite um valor numérico.");

        # Adiciona a temperatura válida à soma total
        soma_total_temperaturas += temperatura_do_mes;

        # Verifica se o mês foi "quente"
        if temperatura_do_mes > 33.0:
            contagem_meses_quentes += 1;

        # Atualiza a maior temperatura registrada
        if temperatura_do_mes > maior_temperatura_registrada:
            maior_temperatura_registrada = temperatura_do_mes;
            meses_com_maior_temperatura = [nomes_dos_meses[numero_do_mes]];
        elif temperatura_do_mes == maior_temperatura_registrada:
            meses_com_maior_temperatura.append(nomes_dos_meses[numero_do_mes]);

        # Atualiza a menor temperatura registrada
        if temperatura_do_mes < menor_temperatura_registrada:
            menor_temperatura_registrada = temperatura_do_mes;
            meses_com_menor_temperatura = [nomes_dos_meses[numero_do_mes]];
        elif temperatura_do_mes == menor_temperatura_registrada:
            meses_com_menor_temperatura.append(nomes_dos_meses[numero_do_mes]);

    print("\n--- Resultados Finais da Análise ---")
    # Calcula e exibe a média anual
    media_temperatura_anual = soma_total_temperaturas / 12;
    print(f"Temperatura média máxima anual: {media_temperatura_anual:.2f}°C");
    # Exibe a contagem de meses quentes
    print(f"Número de meses com máximas acima de 33°C: {contagem_meses_quentes}");
    # Exibe a(s) maior(es) temperatura(s)
    print(f"Mês(es) mais quente(s) do ano: {', '.join(meses_com_maior_temperatura)} ({maior_temperatura_registrada:.1f}°C)");
    # Exibe a(s) menor(es) temperatura(s)
    print(f"Mês(es) menos quente(s) do ano: {', '.join(meses_com_menor_temperatura)} ({menor_temperatura_registrada:.1f}°C)");
    print("\n--- Análise Concluída! ---");

# Garante que a função principal seja executada ao rodar o script
if __name__ == "__main__":
    main();