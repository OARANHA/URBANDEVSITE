# Componentes de Chat com IA - UrbanDev

Este projeto contém quatro componentes de chat que utilizam a API da Z.AI com o modelo GLM-4.5-Flash para proporcionar interações inteligentes em tempo real.

## Componentes Disponíveis

### 1. AgentChatReal

**Localização:** `src/components/agent-chat-real.tsx`

Um componente completo de chat com design profissional, ideal para a página de Agentes de IA. Inclui:

- Interface de chat completa com histórico de mensagens
- Indicador de "digitando" durante o processamento
- Design responsivo com duas colunas (chat e capacidades)
- Mensagens de exemplo para demonstração
- Integração total com a API da Z.AI

**Uso:**
```tsx
import { AgentChatReal } from "@/components/agent-chat-real"

// Na página de Agentes de IA
<AgentChatReal />
```

### 2. ChatWidget

**Localização:** `src/components/chat-widget.tsx`

Um widget de chat flutuante que pode ser adicionado a qualquer página do site. Características:

- Botão flutuante no canto inferior direito
- Pode ser minimizado/maximizado
- Janela de chat completa quando aberta
- Pode ser fechado pelo usuário
- Ideal para suporte ao cliente em todo o site

**Uso:**
```tsx
import { ChatWidget } from "@/components/chat-widget"

// Adicionar a qualquer página
<ChatWidget />

// Com opções personalizadas
<ChatWidget 
  title="Suporte IA"
  subtitle="Estou aqui para ajudar"
  initialMessage="Olá! Como posso ajudar você hoje?"
/>
```

### 3. SimpleChat

**Localização:** `src/components/simple-chat.tsx`

Um componente de chat simples e flexível que pode ser incorporado em qualquer parte da página. Características:

- Design limpo e minimalista
- Altura customizável
- Placeholder personalizável
- Ideal para seções específicas das páginas
- Pode ser usado múltiplas vezes na mesma página

**Uso:**
```tsx
import { SimpleChat } from "@/components/simple-chat"

<SimpleChat 
  title="Pergunte à nossa IA"
  placeholder="Digite sua pergunta sobre nossos serviços..."
  height="300px"
/>
```

### 4. MiniChat

**Localização:** `src/components/mini-chat.tsx`

Um componente de chat compacto e minimalista, ideal para espaços menores ou embeds. Características:

- Design ultra-compacto
- Header opcional
- Mensagens iniciais configuráveis
- Perfeito para cards e seções pequenas
- Interface minimalista com texto pequeno

**Uso:**
```tsx
import { MiniChat } from "@/components/mini-chat"

// Versão completa com header
<MiniChat 
  title="Assistente IA"
  placeholder="Pergunte..."
  height="250px"
/>

// Versão minimal sem header
<MiniChat 
  showHeader={false}
  placeholder="Digite aqui..."
  height="200px"
/>

// Com mensagens iniciais
<MiniChat 
  title="Bem-vindo!"
  initialMessages={[
    "Olá! Sou seu assistente de IA.",
    "Como posso ajudar você hoje?"
  ]}
/>
```

## Seção de Demonstração na Página Inicial

Foi adicionada uma seção completa de demonstração na página inicial (`src/app/page.tsx`) com:

### Título: "Experimente Nosso Agente de IA em Ação"
- Subtítulo: "Veja como nosso agente analisa dados, gera insights e toma decisões em tempo real"

### Layout:
- **Coluna Esquerda:** Componente SimpleChat funcional
- **Coluna Direita:** Cards informativos com:
  - Recursos em destaque (Compreensão Contextual, Análise de Dados, Respostas Imediatas)
  - Tecnologia Utilizada (GLM-4.5-Flash, Tempo Real, 99.9% precisão)
  - Exemplos de perguntas para os usuários experimentarem

### Exemplos de Perguntas Sugeridas:
- "Como a IA pode ajudar meu negócio a crescer?"
- "Quais são os principais benefícios da automação?"
- "Como funciona a análise de dados em tempo real?"

## Configuração da API

### Arquivos de Configuração

**Config:** `src/lib/config.ts`
```typescript
export const config = {
  zai: {
    baseUrl: 'https://api.z.ai/api/paas/v4/',
    apiKey: 'd56c89e3fdd24034bd228576e2f40fd5.zfVpIPTnS55T9qRE',
    model: 'GLM-4.5-Flash'
  }
}
```

**Cliente Z.AI:** `src/lib/zai.ts`
- Classe `ZAIClient` para comunicação com a API
- Métodos para chat completion e geração de imagens
- Tratamento de erros integrado

### API Route

**Endpoint:** `src/app/api/chat/route.ts`

Rota API que processa as requisições de chat:

- Recebe mensagens do frontend
- Adiciona prompt de sistema com contexto da UrbanDev
- Envia para a API da Z.AI
- Retorna a resposta processada

## Personalização do Prompt de Sistema

O prompt de sistema pode ser customizado no arquivo `src/app/api/chat/route.ts`:

```typescript
const systemMessage = {
  role: 'system',
  content: `Você é um agente de IA especialista da UrbanDev...
  // Personalize conforme necessário
  `
}
```

## Recursos Comuns

Todos os componentes compartilham:

### 🎨 Design
- Interface responsiva
- Suporte a tema claro/escuro
- Indicadores de carregamento
- Tratamento de erros amigável

### 🤖 Funcionalidades
- Integração real com GLM-4.5-Flash
- Histórico de conversa mantido
- Envio com Enter (Shift+Enter para nova linha)
- Validação de input

### 🔧 Configurações
- Temperatura: 0.7 (balanceado entre criatividade e precisão)
- Max tokens: 1000 (respostas detalhadas)
- Timeout: Tratamento de erros de rede

## Exemplos de Uso

### 1. Página de Demonstração
```tsx
// src/app/agentes/page.tsx
import { AgentChatReal } from "@/components/agent-chat-real"

export default function AgentesPage() {
  return (
    <Layout>
      {/* Conteúdo da página */}
      <AgentChatReal />
    </Layout>
  )
}
```

### 2. Widget Global
```tsx
// src/app/page.tsx
import { ChatWidget } from "@/components/chat-widget"

export default function Home() {
  return (
    <Layout>
      {/* Conteúdo da página */}
      <ChatWidget />
    </Layout>
  )
}
```

### 3. Seção Específica
```tsx
// Em qualquer página
import { SimpleChat } from "@/components/simple-chat"

export default function ContatoPage() {
  return (
    <Layout>
      <div>
        <h1>Fale Conosco</h1>
        <SimpleChat 
          title="Chat de Suporte"
          placeholder="Como podemos ajudar?"
        />
      </div>
    </Layout>
  )
}
```

## Melhorias Futuras

- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Implementar persistência de conversa
- [ ] Adicionar upload de arquivos
- [ ] Criar sistema de feedback das respostas
- [ ] Implementar analytics de uso

## Troubleshooting

### Problemas Comuns

1. **Erro de API 401**
   - Verifique a API key no arquivo `config.ts`
   - Confirme se a key é válida e não expirou

2. **Respostas lentas**
   - O modelo GLM-4.5-Flash pode ter variações de resposta
   - Verifique a conexão de internet

3. **Componente não renderiza**
   - Verifique se todos os imports estão corretos
   - Confirme se os componentes UI estão instalados

### Logs

Os erros são registrados no console do navegador e no servidor. Verifique:
- Console do navegador para erros de frontend
- Terminal do servidor para erros de API
- Network tab para requisições HTTP