const conditions = {
  numeric: [
    { label: 'Maior que', value: '$gt' },
    { label: 'Maior igual que', value: '$gte' },
    { label: 'Menor que', value: '$lt' },
    { label: 'Menor igual que', value: '$lte' },
    { label: 'Entre', value: '$bet' },
  ],
  text: [{ label: 'Contém', value: '$in' }, { label: 'Não Contém', value: '$nin' }],
  date: [
    { label: 'Maior que', value: '$gt' },
    { label: 'Maior igual que', value: '$gte' },
    { label: 'Menor que', value: '$lt' },
    { label: 'Menor igual que', value: '$lte' },
    { label: 'Entre', value: '$bet' },
  ],
};

export { conditions };
