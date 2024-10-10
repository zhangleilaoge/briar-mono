import { ModelEnum } from "briar-shared"
import { useState } from "react"

const useGptModel = () => {
  const options = [
    { value: ModelEnum.Gpt4oMini, label: ModelEnum.Gpt4oMini },
    {
      value: ModelEnum.Gpt4o,
      label: ModelEnum.Gpt4o,
    },
  ]
  const [selectOption, setSelectOption] = useState(options[0])
  const onChange = (value: ModelEnum) => {
    const opt = options.find((option) => option.value === value) || options[0]
    setSelectOption(opt)
  }

  return { selectOption, options, onChange }
}

export default useGptModel
