export interface NodeParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json' | 'credential';
  required: boolean;
  default?: any;
  options?: string[];
  description?: string;
}

export interface FakeNode {
  id: string;
  name: string;
  category: 'AI' | 'Core' | 'Flow' | 'App' | 'Human in the loop' | 'Triggers';
  description: string;
  params: NodeParam[];
}

export const fakeNodes: FakeNode[] = [
  // AI Category
  {
    id: 'openai-chat',
    name: 'OpenAI Chat',
    category: 'AI',
    description: 'Generate text using OpenAI GPT models',
    params: [
      { name: 'model', type: 'select', required: true, options: ['gpt-4', 'gpt-3.5-turbo'], default: 'gpt-4' },
      { name: 'message', type: 'string', required: true, description: 'Input message to send' },
      { name: 'temperature', type: 'number', required: false, default: 0.7 },
      { name: 'max_tokens', type: 'number', required: false, default: 1000 },
      { name: 'api_key', type: 'credential', required: true }
    ]
  },
  {
    id: 'vector-search',
    name: 'Vector Search',
    category: 'AI',
    description: 'Search through vector embeddings',
    params: [
      { name: 'query', type: 'string', required: true, description: 'Search query' },
      { name: 'vector_store', type: 'select', required: true, options: ['pinecone', 'weaviate', 'chroma'] },
      { name: 'top_k', type: 'number', required: false, default: 10 },
      { name: 'threshold', type: 'number', required: false, default: 0.8 }
    ]
  },
  {
    id: 'ai-agent',
    name: 'AI Agent',
    category: 'AI',
    description: 'Deploy an autonomous AI agent',
    params: [
      { name: 'goal', type: 'string', required: true, description: 'Agent objective' },
      { name: 'tools', type: 'multiselect', required: true, options: ['web_search', 'calculator', 'file_system'] },
      { name: 'max_iterations', type: 'number', required: false, default: 10 },
      { name: 'verbose', type: 'boolean', required: false, default: true }
    ]
  },

  // Core Category
  {
    id: 'http-request',
    name: 'HTTP Request',
    category: 'Core',
    description: 'Make HTTP requests to external APIs',
    params: [
      { name: 'url', type: 'string', required: true, description: 'Request URL' },
      { name: 'method', type: 'select', required: true, options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      { name: 'headers', type: 'json', required: false, description: 'Request headers' },
      { name: 'body', type: 'json', required: false, description: 'Request body' },
      { name: 'timeout', type: 'number', required: false, default: 30000 }
    ]
  },
  {
    id: 'code-execute',
    name: 'Code Execute',
    category: 'Core',
    description: 'Execute JavaScript code',
    params: [
      { name: 'code', type: 'string', required: true, description: 'JavaScript code to execute' },
      { name: 'timeout', type: 'number', required: false, default: 5000 },
      { name: 'sandbox', type: 'boolean', required: false, default: true }
    ]
  },
  {
    id: 'webhook',
    name: 'Webhook',
    category: 'Core',
    description: 'Send webhook notifications',
    params: [
      { name: 'url', type: 'string', required: true, description: 'Webhook URL' },
      { name: 'payload', type: 'json', required: true, description: 'Data to send' },
      { name: 'secret', type: 'credential', required: false }
    ]
  },

  // Flow Category
  {
    id: 'if-condition',
    name: 'If Condition',
    category: 'Flow',
    description: 'Conditional branching logic',
    params: [
      { name: 'condition', type: 'string', required: true, description: 'Boolean expression' },
      { name: 'true_path', type: 'string', required: false, description: 'Action if true' },
      { name: 'false_path', type: 'string', required: false, description: 'Action if false' }
    ]
  },
  {
    id: 'switch-case',
    name: 'Switch Case',
    category: 'Flow',
    description: 'Multiple condition branching',
    params: [
      { name: 'input', type: 'string', required: true, description: 'Value to evaluate' },
      { name: 'cases', type: 'json', required: true, description: 'Case mapping object' },
      { name: 'default_case', type: 'string', required: false, description: 'Default action' }
    ]
  },
  {
    id: 'loop',
    name: 'Loop',
    category: 'Flow',
    description: 'Iterate over data or repeat actions',
    params: [
      { name: 'type', type: 'select', required: true, options: ['for', 'while', 'foreach'] },
      { name: 'condition', type: 'string', required: false, description: 'Loop condition' },
      { name: 'data', type: 'json', required: false, description: 'Data to iterate over' },
      { name: 'max_iterations', type: 'number', required: false, default: 1000 }
    ]
  },

  // App Category
  {
    id: 'slack-message',
    name: 'Slack Message',
    category: 'App',
    description: 'Send messages to Slack channels',
    params: [
      { name: 'channel', type: 'string', required: true, description: 'Slack channel ID or name' },
      { name: 'text', type: 'string', required: true, description: 'Message text' },
      { name: 'bot_token', type: 'credential', required: true },
      { name: 'thread_ts', type: 'string', required: false, description: 'Reply to thread' }
    ]
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'App',
    description: 'Read/write Google Sheets data',
    params: [
      { name: 'spreadsheet_id', type: 'string', required: true },
      { name: 'range', type: 'string', required: true, default: 'A1:Z1000' },
      { name: 'operation', type: 'select', required: true, options: ['read', 'write', 'append'] },
      { name: 'data', type: 'json', required: false, description: 'Data for write/append operations' },
      { name: 'credentials', type: 'credential', required: true }
    ]
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'App',
    description: 'Manage Google Drive files',
    params: [
      { name: 'operation', type: 'select', required: true, options: ['upload', 'download', 'list', 'delete'] },
      { name: 'file_id', type: 'string', required: false, description: 'File ID for operations' },
      { name: 'folder_id', type: 'string', required: false, description: 'Folder to upload to' },
      { name: 'file_name', type: 'string', required: false },
      { name: 'credentials', type: 'credential', required: true }
    ]
  },

  // Human in the loop Category
  {
    id: 'send-email',
    name: 'Send Email',
    category: 'Human in the loop',
    description: 'Send email notifications',
    params: [
      { name: 'to', type: 'string', required: true, description: 'Recipient email address' },
      { name: 'subject', type: 'string', required: true },
      { name: 'body', type: 'string', required: true },
      { name: 'from', type: 'string', required: false },
      { name: 'smtp_config', type: 'credential', required: true }
    ]
  },
  {
    id: 'approval-request',
    name: 'Approval Request',
    category: 'Human in the loop',
    description: 'Request human approval before proceeding',
    params: [
      { name: 'message', type: 'string', required: true, description: 'Approval request message' },
      { name: 'approver', type: 'string', required: true, description: 'Email of approver' },
      { name: 'timeout', type: 'number', required: false, default: 86400, description: 'Timeout in seconds' },
      { name: 'auto_approve', type: 'boolean', required: false, default: false }
    ]
  },

  // Triggers Category
  {
    id: 'webhook-trigger',
    name: 'Webhook Trigger',
    category: 'Triggers',
    description: 'Trigger workflow from webhook',
    params: [
      { name: 'endpoint', type: 'string', required: false, description: 'Custom endpoint path' },
      { name: 'methods', type: 'multiselect', required: true, options: ['GET', 'POST', 'PUT', 'DELETE'], default: ['POST'] },
      { name: 'authentication', type: 'select', required: false, options: ['none', 'api_key', 'basic_auth'] },
      { name: 'secret_key', type: 'credential', required: false }
    ]
  },
  {
    id: 'schedule-trigger',
    name: 'Schedule Trigger',
    category: 'Triggers',
    description: 'Trigger workflow on schedule',
    params: [
      { name: 'cron', type: 'string', required: true, description: 'Cron expression' },
      { name: 'timezone', type: 'string', required: false, default: 'UTC' },
      { name: 'enabled', type: 'boolean', required: false, default: true }
    ]
  },
  {
    id: 'slack-trigger',
    name: 'Slack Trigger',
    category: 'Triggers',
    description: 'Trigger from Slack events',
    params: [
      { name: 'event_type', type: 'select', required: true, options: ['message', 'mention', 'reaction', 'channel_join'] },
      { name: 'channel', type: 'string', required: false, description: 'Specific channel to monitor' },
      { name: 'bot_token', type: 'credential', required: true },
      { name: 'filter', type: 'string', required: false, description: 'Message filter regex' }
    ]
  }
];