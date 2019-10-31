import { withKnobs } from '@storybook/addon-knobs';
import { checkA11y } from '@storybook/addon-a11y';
import { withEditor } from '../other/withEditor';

import Switcher, { Expander } from './switcher';
import { items } from './accordion/implementations';
import { AccordionContents, AccordionButton } from './accordion/common';

export default {
  title: 'Components|Switcher',

  decorators: [
    checkA11y,
    withEditor,
    withKnobs({
      escapeHTML: false,
    }),
  ],
};

export const any = () => ({ Switcher, items, Expander, AccordionButton, AccordionContents });

any.story = {
  name: 'any',
  parameters: {
    editor: `
      <Switcher initial={[1, 0, 0]}>
        {({ actives, setActives }) => {
          const update = index => {
            const l = actives.slice();
            l[index] = !l[index];
            setActives(l);
          };        

          return (
            items.map((item, index) => (
              <Expander key={item.title} active={actives[index]} onClick={() => update(index)}>
                <AccordionButton>{item.title}</AccordionButton>
                <AccordionContents>{item.contents}</AccordionContents>
              </Expander>
            ))
          );
        }}
      </Switcher>
    `,
  },
};

export const single = () => ({ Switcher, items, Expander, AccordionButton, AccordionContents });

single.story = {
  name: 'single',
  parameters: {
    editor: `
      <Switcher initial={[1, 0, 0]}>
        {({ actives, setActives }) => {
          const update = index => {
            const l = actives.slice().fill(0);
            l[index] = 1;
            setActives(l);
          };

          return (
            items.map((item, index) => (
              <Expander key={item.title} active={actives[index]} onClick={() => update(index)}>
                <AccordionButton>{item.title}</AccordionButton>
                <AccordionContents>{item.contents}</AccordionContents>
              </Expander>
            ))
          );
        }}
      </Switcher>
    `,
  },
};

// export const single = () => {
//   const localItems = object('Items', [
//     { title: 'red', contents: 'This is the color red' },
//     { title: 'white', contents: 'This is the color white' },
//     { title: 'blue', contents: 'This is the color blue' },
//   ]);

//   return (
//     <Switcher initial={localItems.slice().fill(0)}>
//       {({ actives, setActives }) => {
//         const set = index => {
//           const l = actives.slice().fill(0);
//           l[index] = 1;
//           setActives(l);
//         };

//         return (
//           <Fragment>
//             {localItems.map((item, index) => (
//               <Expander key={item.title} active={actives[index]} onClick={() => set(index)}>
//                 <AltButton color={item.title}>{item.title}</AltButton>
//                 <AltContent>{item.contents}</AltContent>
//               </Expander>
//             ))}
//           </Fragment>
//         );
//       }}
//     </Switcher>
//   );
// };

// single.story = {
//   name: 'single',
// };
