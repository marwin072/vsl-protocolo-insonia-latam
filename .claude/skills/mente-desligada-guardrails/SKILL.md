---
name: mente-desligada-guardrails
description: >
  Regras de projeto OBRIGATÓRIAS para qualquer mudança de frontend na
  landing page Mente Desligada. Consulte SEMPRE antes de editar animação,
  tema, estado interativo ou performance. Cobre: proibição permanente de
  WebGL/Three.js, fonte única de estado para elementos interativos, valores
  de motion já validados, estrutura de tema dark-padrão, requisitos de
  contraste, e o protocolo de verificação obrigatório antes de reportar
  qualquer tarefa como concluída. Acione esta skill em toda tarefa de
  frontend deste projeto, mesmo que não mencionada explicitamente.
---

# Regras do Projeto — Mente Desligada (Landing Page)

## Proibições permanentes
- NUNCA usar WebGL, Three.js, Canvas 3D, shaders GLSL, ou qualquer motor
  de renderização por GPU para efeitos visuais/backgrounds decorativos.
  Decisão de projeto, já revisitada e recusada múltiplas vezes: CSS + GSAP
  apenas. Motivo: custo de GPU incompatível com tráfego mobile de anúncio,
  que é a maioria do público. Se uma referência visual (ex: componentes de
  galerias como 21st.dev) usar WebGL, extrair a TÉCNICA/composição em CSS,
  nunca copiar a implementação original.
- NUNCA usar `localStorage`/`sessionStorage` para estado. Estado em
  memória/React state.
- NUNCA duplicar a fonte de verdade de um mesmo dado interativo (ex: uma
  variável para hover, outra para clique, outra para navegação numérica —
  todas devem ler/escrever no MESMO estado único).

## Padrões de motion (reutilizar sempre — não inventar novos valores)
- Reveals de entrada (seções, títulos): duração 1.1–1.6s, ease `power3.out`.
- Micro-interações (hover, clique, toggle): 0.35–0.5s, ease `power2.out`.
- Loops ambientes (bloom pulsando, órbita girando, poeira flutuando):
  6–80s. Nunca `ease: linear` em algo que o olho acompanha de perto
  (exceção: rotação contínua pura de 360°).
- Stagger entre elementos irmãos: 0.12–0.2s.
- Simetria de scroll: reveals simples revertem ao rolar para cima com a
  MESMA animação da entrada. Reveals complexos (coreografia com múltiplos
  elementos) revertem numa versão SIMPLIFICADA (fade/opacity apenas) — não
  a coreografia completa — para não dobrar custo de GPU a cada mudança de
  direção do scroll.
- Toda duração/easing deve referenciar a config central de motion do
  projeto (motion.config.ts ou equivalente) — nunca valor solto inline.

## Tema (dark é o padrão)
- Carga inicial SEMPRE em tema escuro, independente de
  `prefers-color-scheme` do sistema do visitante. Toggle disponível para
  trocar para claro manualmente.
- Tokens: `:root` = paleta escura (padrão). `[data-theme="light"]` =
  paleta clara (caso especial, precisa de adaptação própria, não é a
  paleta escura "invertida" preguiçosamente).
- Contraste mínimo: 4.5:1 para texto de corpo, 3:1 para títulos — em
  AMBOS os temas, verificado com ferramenta real, não a olho.
- Nenhum componente pode ter cor de fundo/texto/borda FIXA (hex/rgb/classe
  Tailwind tipo `bg-white` hardcoded) — tudo deve referenciar tokens de
  tema centralizados.
- Antes de qualquer mudança de tema, verificar a config do Tailwind
  (`darkMode`): precisa estar em `'class'`/`'selector'` amarrado ao mesmo
  atributo `data-theme` do resto do projeto — nunca `'media'` (que ignora
  o estado JS e quebra a estratégia de tema).

## Acessibilidade
- `prefers-reduced-motion`: desliga TODOS os loops ambientes e reveals
  complexos; entrega o estado final direto, navegável por clique/toque.
- Elementos interativos focáveis por teclado (tab), com `aria-label`
  descritivo do conteúdo (ex: "Noite 1 — O Despejo Mental").

## PROTOCOLO DE VERIFICAÇÃO OBRIGATÓRIO
Nenhuma tarefa é reportada como concluída sem passar por todos os passos
abaixo. Isto existe porque uma entrega anterior quebrou a página inteira
(tela em branco) sem que isso fosse detectado antes do reporte.

1. Criar um checkpoint git (commit ou stash) ANTES de iniciar qualquer
   mudança, para permitir rollback imediato.
2. Após a mudança, RODAR o build e/ou o servidor de dev — nunca presumir
   que compila sem checar.
3. Ler os erros de compilação E os erros de console do navegador (abrir a
   página real com a ferramenta de browser disponível e inspecionar o
   console, não só o terminal).
4. Tirar um screenshot real da página renderizada, confirmando
   visualmente que ela NÃO está em branco, quebrada ou travada em tela de
   carregamento.
5. Testar em pelo menos 2 tamanhos de viewport (mobile ~375px e desktop
   ~1440px).
6. Só reportar "concluído" depois que 1–5 passarem sem erro. Se qualquer
   passo falhar: reverter ao checkpoint do passo 1 imediatamente e
   reportar exatamente o que quebrou — nunca insistir por cima de um erro
   não resolvido.
