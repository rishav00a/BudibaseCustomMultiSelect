export const getOptions = (
    optionsSource,
    fieldSchema,
    dataProvider,
    labelColumn,
    valueColumn,
    customOptions,
    customDataProvider,
    customLabelColumn,
    customValueColumn
  ) => {
    // Take options from schema
    if (optionsSource == null || optionsSource === "schema") {
      return fieldSchema?.constraints?.inclusion ?? []
    }

    if (optionsSource === "custom_provider" && customValueColumn) {
        let valueCache = {};
        let options = [];
    
        const getNestedValue = (obj, path) => {
            return path.split('.').reduce((acc, key) => {
                // Check if the current level is a string and try to parse it as JSON
                if (typeof acc === 'string') {
                    try {
                        acc = JSON.parse(acc);
                    } catch (e) {
                        return undefined; // If parsing fails, return undefined
                    }
                }

                if (key.includes('index__')) {
                    const parts = key.split('index__');
                    const index = parseInt(parts[1], 10); // Array index inside brackets
                    return Array.isArray(acc) ? acc[index] : undefined; // Access the index in the array
                } 
                return acc?.[key];
            }, obj);
        };
    
        customDataProvider?.rows?.forEach(row => {
            const value = getNestedValue(row, customValueColumn);
            if (value != null && !valueCache[value]) {
                valueCache[value] = true;
                const label = getNestedValue(row, customLabelColumn) || value;
                options.push({ value, label });
            }
        });
    
        return options;
    }
    

    
  
    // Extract options from data provider
    if (optionsSource === "provider" && valueColumn) {
      let valueCache = {}
      let options = []
      dataProvider?.rows?.forEach(row => {
        const value = row?.[valueColumn]
        if (value != null && !valueCache[value]) {
          valueCache[value] = true
          const label = row[labelColumn] || value
          options.push({ value, label })
        }
      })
      return options
    }
  
    // Extract custom options
    if (optionsSource === "custom" && customOptions) {
      customOptions.forEach(option => {
        if (typeof option.value === "string") {
          if (option.value.toLowerCase() === "true") {
            option.value = true
          } else if (option.value.toLowerCase() === "false") {
            option.value = false
          }
        }
      })
      return customOptions
    }
  
    return []
  }