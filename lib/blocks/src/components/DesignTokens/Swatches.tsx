import React from 'react';
import { Box, Stack, Text } from '../../primitives';
import { ColorSwatchStyles } from './Swatches.css';

export type TokenName = string;

export type TokenValue = string | number | boolean | TokenValue[];

interface TokenCommon {
  /**
   * See https://design-tokens.github.io/community-group/format/#description
   */
  $description?: string;
  /**
   * See https://design-tokens.github.io/community-group/format/#type-0
   */
  $type?: string;
}

export interface ComplexToken extends TokenCommon {
  $value: TokenValue;
}

export interface TokenGroup extends TokenCommon {
  /**
   * Tokens can hold groups of tokens
   */
  [key: string]: TokenValue | ComplexToken | TokenGroup;
}

export type TokenObject = {
  name: TokenName;
  value: TokenValue | TokenObject[];
  description?: ComplexToken['$description'];
  type?: ComplexToken['$type'];
};

export type SwatchesProps = {
  tokens: TokenGroup;
  children: (token: TokenObject) => React.ReactNode;
};

export function getRecursiveTokens<T extends TokenValue | ComplexToken | TokenGroup>(
  tokens: Record<TokenName, T>,
  baseName?: string
): TokenObject[] {
  return Object.entries(tokens)
    .map(([key, value]) => {
      const tokenName: string = [baseName, key].filter(Boolean).join('.');

      // Ignore keys that aren't token names i.e. $type, $description
      if (key.startsWith('$')) {
        return null;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        // This is a "simple" token i.e. {[key]: value} pair
        return {
          name: tokenName,
          value,
        };
      }

      if (typeof value === 'object') {
        if ('$value' in value) {
          // It's a "complex" token i.e. it has `$value`
          const { $value, $type, $description } = value as ComplexToken;
          return {
            name: tokenName,
            value: $value,
            description: $description,
            type: $type,
          };
        }
        if (Array.isArray(value)) {
          // It's an array of values
          return {
            name: tokenName,
            value: getRecursiveTokens(
              value.reduce((acc, item, index) => {
                // @ts-ignore
                acc[index] = item;
                return acc;
              }, {}),
              tokenName
            ),
          };
        }
        // It's a group of tokens, so recurse to get tokens from the group
        return {
          name: tokenName,
          value: getRecursiveTokens(value, key),
        };
      }

      // Return null otherwise
      return null;
    })
    .filter(Boolean);
}

export const Swatches = ({ tokens, children }: SwatchesProps) => {
  const tokensArray = getRecursiveTokens(tokens);
  return <>{tokensArray.map(children)}</>;
};

export const ColorSwatch = ({ name, value }: TokenObject) => {
  return (
    <Stack
      gap="small"
      css={{
        display: 'flex',
        justifyContent: 'flex-end',
        flexGrow: 1,
      }}
    >
      <Box className={ColorSwatchStyles}>
        <Box
          css={{
            width: '100%',
            height: '100%',
          }}
          style={{
            background: String(value),
          }}
        />
      </Box>
      <Text tone="loud" size="s2">
        {name}
      </Text>
      <Text tone="muted" size="s1">
        {value}
      </Text>
    </Stack>
  );
};

export const ColorPalette = ({ tokens }: { tokens: TokenObject[] }) => {
  return (
    <Stack gap="small" orientation="horizontal">
      {tokens.map((token) => (
        <ColorSwatch key={token.name} {...token} />
      ))}
    </Stack>
  );
};
