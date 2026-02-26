export type TextPart = {
  type: 'text';
  text: string;
};

export type ImagePart = {
  type: 'image';
  data: string;
  mimeType: string;
};

export type FilePart = {
  type: 'file';
  filename?: string;
  data: string;
  mimeType: string;
};

export type ToolUsePart = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
  displayName?: string;
  description?: string;
};

export type ReasoningPart = {
  type: 'reasoning';
  text: string;
};

export type ToolResultPart = {
  type: 'tool_result';
  id: string;
  name: string;
  input: Record<string, any>;
  result: ToolResult;
};

export type ToolResultPart2 = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  input: Record<string, any>;
  result: ToolResult;
};

export type SystemMessage = {
  role: 'system';
  content: string;
};

export type UserContent = string | Array<TextPart | ImagePart>;

export type UserMessage = {
  role: 'user';
  content: UserContent;
  hidden?: boolean;
};

export type AssistantContent =
  | string
  | Array<TextPart | ReasoningPart | ToolUsePart>;

export type AssistantMessage = {
  role: 'assistant';
  content: AssistantContent;
  text: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
    totalTokens: number;
  };
};

export type ToolContent = Array<ToolResultPart>;

export type ToolMessage = {
  role: 'user';
  content: ToolContent;
};

export type ToolMessage2 = {
  role: 'tool';
  content: ToolResultPart2[];
};

export type Message =
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage
  | ToolMessage2;

export type NormalizedMessage = Message & {
  type: 'message';
  timestamp: string;
  uuid: string;
  parentUuid: string | null;
  uiContent?: string;
};

export type ToolUse = {
  name: string;
  params: Record<string, any>;
  callId: string;
};

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type TodoReadReturnDisplay = {
  type: 'todo_read';
  todos: TodoItem[];
};

export type TodoWriteReturnDisplay = {
  type: 'todo_write';
  todos: TodoItem[];
};

export type DiffViewerReturnDisplay = {
  type: 'diff_viewer';
  diff: string;
};

export type ReturnDisplay =
  | string
  | DiffViewerReturnDisplay
  | TodoReadReturnDisplay
  | TodoWriteReturnDisplay;

export type ToolResult = {
  llmContent: string | (TextPart | ImagePart)[];
  returnDisplay?: ReturnDisplay;
  isError?: boolean;
};

export type ApprovalCategory = 'read' | 'write' | 'command' | 'network';

export type ApprovalContext = {
  category: ApprovalCategory;
  message: string;
  data?: any;
};

export type ToolApprovalInfo = {
  requiresApproval: boolean;
  context?: ApprovalContext;
};

export type Tool<TSchema = any> = {
  name: string;
  description: string;
  parameters: TSchema;
  execute: (params: any) => Promise<ToolResult>;
  approval?: ToolApprovalInfo;
};

export type ToolUseResult = {
  toolUse: ToolUse;
  result: any;
  approved: boolean;
};

export function toolResultPart2ToToolResultPart(
  part: ToolResultPart2,
): ToolResultPart {
  return {
    type: 'tool_result',
    id: part.toolCallId,
    name: part.toolName,
    input: part.input,
    result: part.result,
  };
}
