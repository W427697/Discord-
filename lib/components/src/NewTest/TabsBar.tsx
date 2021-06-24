import { styled } from '@storybook/theming';
import { borderRadius } from 'polished';
import React, {
  Children,
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ButtonTab } from './components/ButtonTab';
import { ContentTab } from './components/ContentTab';
import { MenuTab } from './components/MenuTab';
import { AddToMapFn, RemoveFromMapFn, TabsBarContext } from './TabsBarContext';
import { TabProps } from './types';
import { sanitizeTabProps } from './utils/sanitize-tab-props';

type TabItems = (React.ReactNode | (() => ReactNode))[];

type TabMap = Record<string, { index: number; props: TabProps }>;

export type TabsBarProps = {
  tabs?: TabProps[];
  tools?: ReactNode;
  staticTools?: boolean;
  selected?: string;
  bordered?: boolean;
  rounded?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const TabsBar: FC<TabsBarProps> = ({
  children,
  tabs = [],
  tools,
  selected,
  bordered,
  staticTools,
  rounded,
  ...rest
}) => {
  const [contentItems, setContentItems] = useState<TabProps[]>([]);
  const [tabItems, setTabItems] = useState<ReactNode[]>([]);
  const [selectedTabId, setSelectedTabId] = useState(selected);
  const tabsMap = useRef<TabMap>({});
  const tabsMapIndexRef = useRef(0);
  const tabItemsLength = children ? Children.count(children) : tabs.length;

  const addToMap: AddToMapFn = useCallback(
    (tab) => {
      const index = tabsMapIndexRef.current + 1;
      tabsMap.current = { ...tabsMap.current, [tab.id]: { index, props: tab } };
      tabsMapIndexRef.current = index;

      if (tabsMapIndexRef.current === tabItemsLength) {
        const newContentItems = Object.keys(tabsMap.current)
          .map((key) => tabsMap.current[key].props)
          .filter((props) => props.type === 'content')
          .map((props) => props);

        setContentItems(newContentItems);
      }
    },
    [tabsMap, tabsMapIndexRef]
  );

  const removeFromMap: RemoveFromMapFn = useCallback(
    (tab) => {
      const newTabsMap = { ...tabsMap.current };
      delete newTabsMap[tab.id];

      tabsMapIndexRef.current -= 1;
      tabsMap.current = newTabsMap;
    },
    [tabsMap, tabsMapIndexRef]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedTabId(id);
    },
    [setSelectedTabId]
  );

  useEffect(() => {
    if (tabs.length > 0 && !children) {
      setTabItems(
        tabs
          .map((tabProps) => sanitizeTabProps(tabProps))
          .map(({ tabProps, htmlProps }) => {
            let Tab: ReactNode;

            switch (tabProps.type) {
              case 'content':
                Tab = <ContentTab {...tabProps} {...htmlProps} />;
                break;
              case 'button':
                Tab = <ButtonTab {...tabProps} {...htmlProps} />;
                break;
              case 'menu':
                Tab = <MenuTab {...tabProps} {...htmlProps} />;
                break;
              default:
                break;
            }

            return Tab;
          })
      );
    }
  }, [children, tabs]);

  useEffect(() => {
    setSelectedTabId(selected);
  }, [selected]);

  return (
    <TabsBarContext.Provider
      value={{ addToMap, removeFromMap, onSelect: handleSelect, selectedTabId }}
    >
      <Wrapper bordered={bordered} rounded={rounded} {...rest}>
        <BarArea>
          <Tabs>{children || tabItems}</Tabs>
          <Tool>{tools}</Tool>
        </BarArea>
        <ContentArea bordered={contentItems.length > 0 && selectedTabId !== undefined}>
          {contentItems.map(({ id, content }) => {
            return (
              <div hidden={id !== selectedTabId}>
                {content instanceof Function ? content() : content}
              </div>
            );
          })}
        </ContentArea>
      </Wrapper>
    </TabsBarContext.Provider>
  );
};

interface WrapperProps {
  bordered: boolean;
  rounded: boolean;
}

const Wrapper = styled.div<WrapperProps>(({ bordered, theme, rounded }) => ({
  border: bordered ? `1px solid ${theme.color.border}` : '0 none',
  borderRadius: rounded ? theme.appBorderRadius : '0',
}));

const BarArea = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const Tabs = styled.div({});

const Tool = styled.div({});

interface ContentAreaProps {
  bordered: boolean;
}

const ContentArea = styled.div<ContentAreaProps>(({ bordered, theme }) => ({
  borderTop: bordered ? `1px solid ${theme.color.border}` : '0 none',
}));
