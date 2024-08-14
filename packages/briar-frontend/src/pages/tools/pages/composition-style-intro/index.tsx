import useAntv from "./hooks/useAntv"

const CompositionApiIntro = () => {
  const { exportPng } = useAntv()
  return (
    <>
      <button onClick={exportPng}></button>
      <div
        id="antv-playground"
        style={{ width: "100%", height: "448px" }}
      ></div>
    </>
  )
}

export default CompositionApiIntro
