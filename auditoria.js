// Módulo isolado de verificação da IA (Exclusivo para BEBIDAS)
function verificarDivergenciaDRE_IA_Bebidas() {
  const container = document.getElementById('container-ia-insights');
  if (!container) return;

  if (typeof receitasOrcadas === 'undefined') return;

  // Busca os meses disponíveis no objeto de receitas de bebidas
  const mesesDisponiveis = Object.keys(receitasOrcadas);
  if (mesesDisponiveis.length === 0) return;

  // Usa o mês selecionado globalmente ou o último importado
  const chaveMesAtivo = (typeof mesAtualDRE !== 'undefined' && mesAtualDRE) 
    ? mesAtualDRE 
    : mesesDisponiveis[mesesDisponiveis.length - 1];

  const orcadosMes = receitasOrcadas[chaveMesAtivo] || {};
  const totalReceitaOrcadaSomaSetores = Object.values(orcadosMes).reduce((a, b) => a + b, 0);

  // Removido o valor fixo de 1.250.000,00. 
  // Agora pega o total consolidado real importado da DRE (Direta + MAP/FAP Bebidas)
  const totalReceitaOrcadaSintetica = (typeof totalReceitaConsolidadaDRE !== 'undefined' && totalReceitaConsolidadaDRE) 
    ? totalReceitaConsolidadaDRE 
    : totalReceitaOrcadaSomaSetores; // Se não houver variável global, assume a soma exata dos setores

  const diffDREOculta = totalReceitaOrcadaSintetica - totalReceitaOrcadaSomaSetores;

  const cardExistente = document.getElementById('card-auditoria-dre-bebidas');

  // Se houver divergência real maior que R$ 1,00
  if (Math.abs(diffDREOculta) > 1 && totalReceitaOrcadaSomaSetores > 0) {
    if (cardExistente) return;

    const cardAlertaDRE = document.createElement('div');
    cardAlertaDRE.id = "card-auditoria-dre-bebidas";
    cardAlertaDRE.className = "p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 shadow-sm mb-2";
    cardAlertaDRE.innerHTML = `
      <div class="font-bold text-amber-900 flex items-center justify-between mb-1">
        <span>⚠️ AUDITORIA DRE (BEBIDAS): Divergência de Detalhamento Detectada</span>
        <span class="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-extrabold">
          Diferença: R$ ${formatarMoedaBR(diffDREOculta)}
        </span>
      </div>
      <div class="text-[11px] leading-relaxed">
        O total consolidado orçado de bebidas na DRE é <strong>R$ ${formatarMoedaBR(totalReceitaOrcadaSintetica)}</strong>, mas a soma dos centros de custo detalhados é <strong>R$ ${formatarMoedaBR(totalReceitaOrcadaSomaSetores)}</strong>.<br>
        Existe um valor não detalhado nas sublinhas de bebidas de <strong>R$ ${formatarMoedaBR(diffDREOculta)}</strong>.
      </div>
    `;
    container.insertBefore(cardAlertaDRE, container.firstChild);
  } else {
    // Se não houver divergência (valores baterem), remove o card de alerta amarelo se ele existir na tela
    if (cardExistente) {
      cardExistente.remove();
    }
  }
}

// Executa a verificação periodicamente
setInterval(verificarDivergenciaDRE_IA_Bebidas, 1000);