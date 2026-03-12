import { useMemo, useState } from 'react';
import Markdown from 'marked-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BrainIcon } from '@hugeicons/core-free-icons';
import type { NormalizedMessage } from '../../client/types/message';
import {
  extractTextParts,
  extractReasoningParts,
  extractToolUseParts,
  pairToolsWithResults,
} from './messageHelpers';
import { ToolMessage } from './ToolMessage';

interface AssistantMessageProps {
  message: NormalizedMessage;
  allMessages: NormalizedMessage[];
}

/**
 * AssistantMessage component
 * Handles text, reasoning (thinking), and tool_use content types
 */
export function AssistantMessage({
  message,
  allMessages,
}: AssistantMessageProps) {
  const textParts = extractTextParts(message);
  const reasoningParts = extractReasoningParts(message);
  const toolUseParts = extractToolUseParts(message);

  // Get subsequent messages for tool pairing
  const messageIndex = allMessages.findIndex((m) => m.uuid === message.uuid);
  const subsequentMessages =
    messageIndex >= 0 ? allMessages.slice(messageIndex + 1) : [];

  // Pair tools with results
  const toolPairs = useMemo(
    () =>
      toolUseParts.length > 0
        ? pairToolsWithResults(message, subsequentMessages)
        : [],
    [message, subsequentMessages, toolUseParts.length],
  );

  return (
    <div className="flex justify-start">
      <div
        style={
          {
            // maxWidth: '80%',
            // backgroundColor: 'var(--bg-surface)',
            // borderRadius: '12px',
            // padding: '12px 0',
          }
        }
      >
        {/* Reasoning (thinking) parts */}
        {reasoningParts.length > 0 && (
          <div style={{ marginBottom: textParts.length > 0 ? '12px' : '0' }}>
            {reasoningParts.map((part, index) => (
              <CollapsibleThought
                key={`reasoning-${message.uuid}-${index}`}
                text={part.text}
              />
            ))}
          </div>
        )}

        {/* Text parts with markdown rendering */}
        {textParts.length > 0 && (
          <div
            style={{
              marginBottom: '12px',
            }}
          >
            {textParts.map((part, index) => (
              <MarkdownContent
                key={`text-${message.uuid}-${index}`}
                content={part.text}
              />
            ))}
          </div>
        )}

        {/* Tool use parts with results */}
        {toolPairs.length > 0 && (
          <div
            style={{
              marginTop: textParts.length > 0 ? '12px' : '0',
              marginBottom: '12px',
            }}
          >
            {toolPairs.map((pair, index) => (
              <ToolMessage
                key={`tool-${pair.toolUse.id}-${index}`}
                pair={pair}
              />
            ))}
          </div>
        )}

        {/* Empty message fallback */}
        {textParts.length === 0 &&
          reasoningParts.length === 0 &&
          toolPairs.length === 0 && (
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                marginBottom: '12px',
              }}
            >
              (Empty message)
            </div>
          )}
      </div>
    </div>
  );
}


// Collapsible Thought block – shows a 200-char preview by default
const THOUGHT_PREVIEW_LENGTH = 200;

function CollapsibleThought({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsCollapse = text.length > THOUGHT_PREVIEW_LENGTH;
  const displayText =
    expanded || !needsCollapse ? text : text.slice(0, THOUGHT_PREVIEW_LENGTH) + '…';

  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <HugeiconsIcon
          icon={BrainIcon}
          size={14}
          color="var(--text-secondary)"
          strokeWidth={1.5}
        />
        <span style={{ fontStyle: 'italic' }}>Thought</span>
      </div>
      <div
        style={{
          paddingLeft: '20px',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
        }}
      >
        <MarkdownContent content={displayText} isThought />
        {needsCollapse && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              marginTop: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {expanded ? '收起' : '展开全部'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * MarkdownContent component
 * Renders markdown text using marked-react
 */
function MarkdownContent({
  content,
  isThought = false,
}: {
  content: string;
  isThought?: boolean;
}) {
  const rendered = useMemo(() => {
    try {
      return content;
    } catch (error) {
      console.error('Failed to parse markdown:', error);
      return content;
    }
  }, [content]);

  return (
    <div
      style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: isThought ? 'var(--text-secondary)' : 'var(--text-primary)',
        fontStyle: isThought ? 'italic' : 'normal',
      }}
      className="markdown-content"
    >
      <Markdown value={rendered} />
    </div>
  );
}
