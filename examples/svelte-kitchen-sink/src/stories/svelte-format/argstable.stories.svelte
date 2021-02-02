<script>
  import { Meta, Story } from '@storybook/svelte';

  import ArgsTableView from '../views/ArgsTableView.svelte';
  // eslint-disable-next-line
  import srcArgsTableView from '!!raw-loader!../views/ArgsTableView.svelte';

</script>

<Meta title="Args Table (Svelte)" component={ArgsTableView}/>

<Story name="ArgsTable" let:args source={srcArgsTableView}>
  <ArgsTableView {...args}/>
</Story>