<script>
  import { getContext, createEventDispatcher, onDestroy } from "svelte";
  import { Multiselect } from "@budibase/bbui";
  import { getOptions } from "./optionsParser";

  // Component props
  export let searchTerm = null;
  export let field;
  export let label;
  export let placeholder;
  export let defaultValue;
  export let helpText = null;
  export let onChange;
  export let autocomplete = false;
  export let disabled = false;
  export let readonly = false;
  export let optionsType = "select";
  export let direction = "vertical";
  export let optionsSource = "schema";
  export let dataProvider;
  export let labelColumn;
  export let valueColumn;
  export let customDataProvider;
  export let customLabelColumn;
  export let customValueColumn;
  export let customOptions;
  export let validation;
  export let span;

  export let onOptionMouseenter = () => {};
  export let onOptionMouseleave = () => {};

  const dispatch = createEventDispatcher();
  const { styleable } = getContext('sdk');
  const component = getContext('component');
  const formContext = getContext('form');
  const formStepContext = getContext('form-step');
  const fieldGroupContext = getContext('field-group');

  let fieldState, fieldApi, fieldSchema, unsubscribe;
  let value = [];

  // Determine the default values as an array
  const parseDefaultValues = (defaultValue) => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : defaultValue.split(",").map(v => v.trim());
  };

  const defaultValueArr = parseDefaultValues(defaultValue);
  value = [...defaultValueArr];

  const formApi = formContext?.formApi;
  $: if (formApi && field) {
    const formField = formApi.registerField(
      field,
      'text',
      [...defaultValueArr],
      false,
      validation,
      formStepContext ? $formStepContext || 1 : 1
    );

    unsubscribe = formField?.subscribe((fieldValue) => {
      fieldState = fieldValue?.fieldState;
      fieldApi = fieldValue?.fieldApi;
      const changed = fieldApi?.setValue(fieldState?.value);
      value = fieldState?.value;
      if (onChange && changed) {
        onChange({ value: fieldState?.value });
      }
    });
  };

  // Define flatOptions based on optionsSource
  $: flatOptions = optionsSource == null || optionsSource === "schema";

  // Reactive declaration to get options
  $: options = getOptions(
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn,
    customOptions,
    customDataProvider,
    customLabelColumn,
    customValueColumn
  );

  // Cleanup on destroy
  onDestroy(() => {
    fieldApi?.deregister();
    unsubscribe?.();
  });

  // Handle change event
  const handleChange = (e) => {
    const changed = fieldApi.setValue(e.detail);
    if (onChange && changed) {
      onChange({ value: e.detail });
    }
  };

  // Functions to get option labels and values
  const getOptionLabel = flatOptions ? (x) => x : (x) => x.label;
  const getOptionValue = flatOptions ? (x) => x : (x) => x.value;
</script>

<div use:styleable={$component.styles}>
  <Multiselect
    {helpText}
    {label}
    {disabled}
    {readonly}
    {options}
    {placeholder}
    {getOptionLabel}
    {getOptionValue}
    {autocomplete}
    {onOptionMouseenter}
    {onOptionMouseleave}
    {value}
    bind:searchTerm
    on:change={handleChange}
  />
</div>
