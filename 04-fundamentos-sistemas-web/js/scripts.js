document.addEventListener('DOMContentLoaded', function () {
    /*
     * A função anônima garante que todo o código interno só será executado
     * após o DOM (Document Object Model) estar completamente carregado,
     * prevenindo erros ao tentar acessar elementos HTML que ainda não existem.
     */

    /**
     * MÓDULO 1: Filtro de Produtos
     * Controla a lógica de exibir/ocultar produtos com base na categoria
     * selecionada por meio de botões de filtro.
     */
    const initProductFilter = () => {
        // Seleciona o contêiner de botões de filtro.
        const filterButtonGroup = document.querySelector('.product-filter-container .btn-group');
        // Seleciona todas as colunas que contêm os cards de produto.
        const productColumns = document.querySelectorAll('#product-grid > .col-6');

        // Se o contêiner de botões não for encontrado, o módulo não será inicializado.
        if (!filterButtonGroup) return;

        // Adiciona um listener de evento de clique ao grupo de botões.
        filterButtonGroup.addEventListener('click', (event) => {
            // Verifica se o clique ocorreu em um botão de filtro válido.
            if (!event.target.matches('.btn-filter')) return;

            const clickedButton = event.target;
            // Obtém o valor do filtro (ex: 'eletronicos', 'todos') do atributo 'data-filter'.
            const filterValue = clickedButton.getAttribute('data-filter');

            // --- 1. Atualiza o estado visual do botão ativo ---
            // Remove a classe 'active' do botão atualmente ativo.
            const currentActive = filterButtonGroup.querySelector('.btn-filter.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            // Adiciona a classe 'active' ao botão que foi clicado.
            clickedButton.classList.add('active');

            // --- 2. Lógica para mostrar/esconder produtos ---
            productColumns.forEach(column => {
                const card = column.querySelector('.product-card');

                // Garante que a coluna contém um card de produto.
                if (!card) return;

                // Obtém a categoria do produto a partir do atributo 'data-category' no card.
                const cardCategory = card.getAttribute('data-category');

                /*
                 * Verifica se o filtro é 'todos' (mostra tudo) ou se a categoria
                 * do card corresponde ao valor do filtro.
                 */
                if (filterValue === 'todos' || filterValue === cardCategory) {
                    // Mostra a coluna usando 'display: block'.
                    column.style.display = 'block';
                } else {
                    // Esconde a coluna usando 'display: none'.
                    column.style.display = 'none';
                }
            });
        });
    };

    /**
     * MÓDULO 2: Formulário Multi-Etapas
     * Controla a navegação (próximo/anterior) entre as etapas de um formulário.
     */
    const initMultiStepForm = () => {
        // Seleciona o formulário principal.
        const form = document.querySelector('.multi-step-form');
        if (!form) return;

        // Seleciona todas as divs/seções que representam as etapas.
        const steps = form.querySelectorAll('.form-step');
        // Seleciona os botões de avanço.
        const nextButtons = form.querySelectorAll('.btn-next');
        // Seleciona os botões de retorno.
        const prevButtons = form.querySelectorAll('.btn-prev');
        // Inicializa o índice da etapa atual.
        let currentStep = 0;

        /**
         * Função auxiliar para mostrar uma etapa específica.
         * @param {number} stepIndex - O índice da etapa a ser mostrada.
         */
        const showStep = (stepIndex) => {
            steps.forEach((step, index) => {
                /*
                 * Alterna a classe 'active': Adiciona se o índice for o atual,
                 * remove se não for. A classe 'active' controla a visibilidade via CSS.
                 */
                step.classList.toggle('active', index === stepIndex);
            });
        };

        // --- Configuração dos botões de PRÓXIMO ---
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Verifica se não estamos na última etapa.
                if (currentStep < steps.length - 1) {
                    // Incrementa o contador da etapa.
                    currentStep++;
                    // Exibe a nova etapa.
                    showStep(currentStep);
                }
            });
        });

        // --- Configuração dos botões de ANTERIOR ---
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Verifica se não estamos na primeira etapa (índice 0).
                if (currentStep > 0) {
                    // Decrementa o contador da etapa.
                    currentStep--;
                    // Exibe a nova etapa.
                    showStep(currentStep);
                }
            });
        });

        // Exibe a primeira etapa ao inicializar o formulário.
        showStep(currentStep);
    };

    // 🚀 Inicializa todos os módulos da aplicação
    initProductFilter();
    initMultiStepForm();
});