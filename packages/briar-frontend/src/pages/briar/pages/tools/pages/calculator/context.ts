import React from 'react';

const CalculateContext = React.createContext({
	calculatorDisabledRef: { current: false }
});

export default CalculateContext;
