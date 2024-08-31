<script>
  import { getContext, createEventDispatcher, onDestroy } from "svelte"
  import { Multiselect } from "@budibase/bbui"

  export let searchTerm = null
  export let field; 
  export let label; 
  export let placeholder; 
  export let defaultValue; 
  export let helpText =null; 
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



  export let onOptionMouseenter = () => {}
  export let onOptionMouseleave = () => {}

  const dispatch = createEventDispatcher()
  

  const { styleable } = getContext('sdk');
  const component = getContext('component');
  const formContext = getContext('form');
  const formStepContext = getContext('form-step');
  const fieldGroupContext = getContext('field-group');
  import { getOptions } from "./optionsParser"


  let fieldState
  let fieldApi
  let fieldSchema
  let unsubscribe;


  $: formStep = formStepContext ? $formStepContext || 1 : 1;
  
  let value = [];
  if(!defaultValue){
    value = []
  }
  else if(Array.isArray(defaultValue)){
    value = defaultValue;
  }
  else{
    value = defaultValue.split(",").map(v => v.trim())
  }

  

  const formApi = formContext?.formApi;
  $: if (formApi && field) {
        const formField = formApi.registerField(
            field,
            'text',
            ["123"], 
            false,
            validation,
            formStep
        );

        unsubscribe = formField?.subscribe(async (fieldValue) => {
            fieldState = fieldValue?.fieldState;
            fieldApi = fieldValue?.fieldApi;            

        });
    };



  $: flatOptions = optionsSource == null || optionsSource === "schema"
  
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
  )

  onDestroy(() => {
        fieldApi?.deregister();
        unsubscribe?.();
    });

  

  const handleChange = e => {
    const changed = fieldApi.setValue(e.detail)
    if (onChange && changed) {
      onChange({ value: e.detail })
    }
  }
  let getOptionLabel=flatOptions ? x => x : x => x.label
  let getOptionValue=flatOptions ? x => x : x => x.value
</script>

<div use:styleable={$component.styles}>
  <Multiselect
    {helpText} {label} 
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
    on:click
    
  />
  
</div>
