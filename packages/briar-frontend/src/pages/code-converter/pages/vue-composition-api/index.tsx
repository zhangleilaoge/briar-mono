import "prismjs/themes/prism.css"

import { GithubFilled } from "@ant-design/icons"
import { convert, InputType } from "@zhangleilaoge/vue-code-converter"
import {
  Alert,
  Button,
  Drawer,
  FloatButton,
  Form,
  message,
  Radio,
  RadioChangeEvent,
  Slider,
} from "antd"
import TextArea from "antd/es/input/TextArea"
import Prism from "prismjs"
import { FC, useEffect, useMemo, useRef, useState } from "react"

import { DEMO } from "./constants/demo"
import { COMPOSITION_API_CONFIG } from "./constants/formConfig"
import s from "./style.module.scss"
import { IConfigForm } from "./type"
import { copyToClipboard } from "@/utils/document"

const CompositionStyleConvert: FC = () => {
  const [inputType, setInputType] = useState<InputType>()
  const [demoType, setDemoType] = useState<InputType>()

  // 输入与输入
  const [input, setInput] = useState<string>(DEMO[InputType.OptionStyle])
  const [output, setOutput] = useState<string>("")

  // domRef
  const outputRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 输入区相关提示
  const [inputTipType, setInputTipType] = useState<
    "info" | "warning" | "error"
  >()
  const [inputTip, setInputTip] = useState("")

  // 设置
  const [configShow, setConfigShow] = useState(false)
  const [configFormValue, setConfigFormValue] = useState(COMPOSITION_API_CONFIG)
  const [form] = Form.useForm()

  const onConfigFormChange = (val: IConfigForm) => {
    setConfigFormValue(val)
  }

  const onDemoChange = (e: RadioChangeEvent) => {
    setDemoType(e?.target?.value)
    setInput(DEMO[e.target.value as InputType])
  }

  const onInputChange = (e: any) => {
    setInput(e.target.value)
    setDemoType(undefined)
  }

  const copyOutput = () => {
    copyToClipboard(output)

    message.success("复制成功")
  }

  const showConfig = () => {
    setConfigShow(true)
  }

  const hideConfig = () => {
    setConfigShow(false)
  }

  useEffect(() => {
    const codeElement = outputRef?.current
    if (codeElement) {
      codeElement.textContent = output
      Prism.highlightElement(codeElement)
    }
  }, [output])

  useEffect(() => {
    try {
      setInputTipType(undefined)
      setInputTip("")

      console.log("convertSrc start", Date.now())

      const {
        output: convertOutput,
        inputType: convertInputType,
        warning,
      } = convert(input, {
        strict: true,
        prettier: {
          printWidth: configFormValue.outputPrintWidth,
        },
      })

      console.log("convertSrc end", Date.now())

      setInputType(convertInputType)
      setOutput(convertOutput)

      if (warning) {
        setInputTipType("warning")
        setInputTip(warning)
      } else if (convertInputType === InputType.CompositionApi) {
        setInputTipType("info")
        setInputTip("Composition API 无需转换")
      }
    } catch (err: any) {
      setInputTipType("error")
      setInputTip(err?.message || JSON.stringify(err))
      setInputType(undefined)
      console.error(err)
    }
  }, [configFormValue.outputPrintWidth, input])

  const status = useMemo(() => {
    return ["error", "warning"].includes(inputTipType || "")
      ? (inputTipType as "error" | "warning")
      : ""
  }, [inputTipType])

  return (
    <>
      {/* 视图区域 */}
      <div className={s.Container} ref={containerRef}>
        {/* 输入区 */}
        <div className={s.Input}>
          <div className={s.Head}>
            <div>Input: (Vue2{inputType ? ` / ${inputType}` : ""})</div>
            <Radio.Group onChange={onDemoChange} value={demoType}>
              <Radio.Button value={InputType.OptionStyle}>
                option demo
              </Radio.Button>
              <Radio.Button value={InputType.DecorateStyle}>
                decorator demo
              </Radio.Button>
            </Radio.Group>
          </div>
          <TextArea
            status={status}
            className={s.InputCode}
            placeholder="input your vue2 code here..."
            onChange={onInputChange}
            value={input}
          />
          {inputTipType === "error" ? (
            <Alert message={inputTip} type="error" showIcon />
          ) : null}
          {inputTipType === "warning" ? (
            <Alert message={inputTip} type="warning" showIcon />
          ) : null}
          {inputTipType === "info" ? (
            <Alert message={inputTip} type="info" showIcon />
          ) : null}
        </div>
        {/* 输出区 */}
        <div className={s.Output}>
          <div className={s.Head}>
            Output: (Vue2 / Composition API)
            <div className={s.ButtonGroup}>
              <Button type="default" onClick={showConfig}>
                设置
              </Button>
              <Button type="primary" onClick={copyOutput}>
                复制
              </Button>
            </div>
          </div>
          <pre className={`lang-javascript ${s.OutputCode}`} ref={outputRef}>
            <code className="code-output-content">{output}</code>
          </pre>
        </div>
        {/* 操作区 */}
        <FloatButton.Group shape="circle">
          <FloatButton
            icon={<GithubFilled />}
            href="https://github.com/zhangleilaoge/briar-mono/tree/main/packages/vue-code-converter"
            target="_blank"
          />
          {/* todo 增加一个介绍页 */}
          {/* <FloatButton
            icon={<QuestionCircleOutlined />}
            href="https://github.com/zhangleilaoge/briar-mono/tree/main/packages/vue-code-converter"
            target="_blank"
          /> */}
        </FloatButton.Group>
      </div>
      {/* 设置区域 */}
      <Drawer onClose={hideConfig} open={configShow}>
        <Form
          layout={"vertical"}
          form={form}
          onValuesChange={onConfigFormChange}
        >
          <Form.Item label="output printWidth:" name="outputPrintWidth">
            <Slider
              min={40}
              max={120}
              value={configFormValue.outputPrintWidth}
              defaultValue={COMPOSITION_API_CONFIG.outputPrintWidth}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default CompositionStyleConvert
