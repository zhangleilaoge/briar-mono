import { Graph, Cell, Node, Dom } from "@antv/x6"
import dagre from "dagre"
import { register } from "@antv/x6-react-shape"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Pop } from "zent"
import { Export } from "@antv/x6-plugin-export"

enum CompareTypeEnum {
  YearOnYear = "yearOnYear",
  MonthOnMonth = "monthOnMonth",
}

interface IGraphNode {
  key: string
  parent?: string
  proportion?: number
  content: {
    title: string
    subTitle: string
    value: string
    compareType?: CompareTypeEnum
    compareRadio?: number
    borderColor?: string
    backgroundColor?: string
  }
  popContent?: {
    desc?: string
    value?: string
  }
}

const nodeWidth = 260
const nodeHeight = 88
const male =
  "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ"
const female =
  "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ"
// 布局方向
const dir = "TB" // LR RL TB BT
// 自定义节点
Graph.registerNode(
  "org-node",
  {
    width: nodeWidth,
    height: nodeHeight,
    markup: [
      {
        tagName: "rect",
        attrs: {
          class: "card",
        },
      },
      {
        tagName: "image",
        attrs: {
          class: "image",
        },
      },
      {
        tagName: "text",
        attrs: {
          class: "rank",
        },
      },
      {
        tagName: "text",
        attrs: {
          class: "name",
        },
      },
      {
        tagName: "g",
        attrs: {
          class: "btn add",
        },
        children: [
          {
            tagName: "circle",
            attrs: {
              class: "add",
            },
          },
          {
            tagName: "text",
            attrs: {
              class: "add",
            },
          },
        ],
      },
      {
        tagName: "g",
        attrs: {
          class: "btn del",
        },
        children: [
          {
            tagName: "circle",
            attrs: {
              class: "del",
            },
          },
          {
            tagName: "text",
            attrs: {
              class: "del",
            },
          },
        ],
      },
    ],
    attrs: {
      ".card": {
        rx: 10,
        ry: 10,
        refWidth: "100%",
        refHeight: "100%",
        fill: "#5F95FF",
        stroke: "#5F95FF",
        strokeWidth: 1,
        pointerEvents: "visiblePainted",
      },
      ".image": {
        x: 16,
        y: 16,
        width: 56,
        height: 56,
        opacity: 0.7,
      },
      ".rank": {
        refX: 0.95,
        refY: 0.5,
        fill: "#fff",
        fontFamily: "Courier New",
        fontSize: 13,
        textAnchor: "end",
        textVerticalAnchor: "middle",
      },
      ".name": {
        refX: 0.95,
        refY: 0.7,
        fill: "#fff",
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: "600",
        textAnchor: "end",
      },
      ".btn.add": {
        refDx: -16,
        refY: 16,
      },
      ".btn.del": {
        refDx: -44,
        refY: 16,
      },
      ".btn > circle": {
        r: 10,
        fill: "transparent",
        stroke: "#fff",
        strokeWidth: 1,
      },
      ".btn.add > text": {
        fontSize: 20,
        fontWeight: 800,
        fill: "#fff",
        x: -5.5,
        y: 7,
        fontFamily: "Times New Roman",
        text: "+",
      },
      ".btn.del > text": {
        fontSize: 28,
        fontWeight: 500,
        fill: "#fff",
        x: -4.5,
        y: 6,
        fontFamily: "Times New Roman",
        text: "-",
      },
    },
  },
  true
)

// 自定义边
Graph.registerEdge(
  "org-edge",
  {
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: "#A2B1C3",
        sourceMarker: null,
        targetMarker: null,
      },
    },
    defaultLabel: {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        label: {
          fill: "#000",
          fontSize: 14,
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          pointerEvents: "none",
        },
        body: {
          ref: "label",
          fill: "#ffd591",
          stroke: "#ffa940",
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: "140%",
          refHeight: "140%",
          refX: "-20%",
          refY: "-20%",
        },
      },
      position: {
        distance: -30,
        options: {
          absoluteDistance: true,
          // reverseDistance: true,
        },
      },
    },
  },
  true
)

const NodeComponent = () => {
  return (
    <div
      className="react-node"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
      }}
    >
      <Pop trigger="hover" content="鼠标移入触发方式">
        你好
      </Pop>
    </div>
  )
}

register({
  shape: "custom-react-node",
  width: nodeWidth,
  height: nodeHeight,
  component: NodeComponent,
})

const useAntv = () => {
  const [graph, setGraph] = useState<Graph>()

  const exportPng = () => {
    graph?.exportPNG("导出图片名称", {
      quality: 0.8,
      backgroundColor: "black",
    })
  }

  // 自动布局
  const layout = useCallback(() => {
    console.log("layout", graph)
    if (!graph) return
    const nodes = graph.getNodes()
    const edges = graph.getEdges()
    const g = new dagre.graphlib.Graph()
    g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 })
    g.setDefaultEdgeLabel(() => ({}))

    const width = nodeWidth
    const height = 200
    nodes.forEach((node) => {
      g.setNode(node.id, { width, height })
    })

    edges.forEach((edge) => {
      const source = edge.getSource()
      const target = edge.getTarget()
      g.setEdge(source.cell, target.cell)
    })

    dagre.layout(g)

    g.nodes().forEach((id) => {
      const node = graph.getCellById(id) as Node
      if (node) {
        const pos = g.node(id)
        node.position(pos.x, pos.y)
      }
    })

    edges.forEach((edge) => {
      const source = edge.getSourceNode()!
      const target = edge.getTargetNode()!
      const sourceBBox = source.getBBox()
      const targetBBox = target.getBBox()

      if (sourceBBox.x !== targetBBox.x) {
        const gap = targetBBox.y - sourceBBox.y - sourceBBox.height

        const fix = sourceBBox.height
        const y = sourceBBox.y + fix + gap / 2
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y },
        ])
      } else {
        edge.setVertices([])
      }
    })
  }, [graph])

  const createNode = useCallback(
    (rank: string, name: string, image: string) => {
      // return graph?.createNode({
      //   shape: "org-node",
      //   attrs: {
      //     ".image": { xlinkHref: image },
      //     ".rank": {
      //       text: Dom.breakText(rank, { width: 160, height: 45 }),
      //     },
      //     ".name": {
      //       text: Dom.breakText(name, { width: 160, height: 45 }),
      //     },
      //   },
      // })
      return graph?.createNode({
        shape: "custom-react-node",
      })
    },
    [graph]
  )

  const createEdge = useCallback(
    (source: Cell, target: Cell) => {
      return graph?.createEdge({
        shape: "org-edge",
        source: { cell: source.id },
        target: { cell: target.id },
        attrs: {
          line: {
            stroke: "#ccc",
          },
        },
        labels: [
          {
            attrs: {
              line: {
                stroke: "#73d13d",
              },
              text: {
                text: "Custom Label",
              },
            },
          },
        ],
      })
    },
    [graph]
  )

  const nodes = useMemo(
    () => [
      // createNode('Founder & Chairman', 'Pierre Omidyar', male),
      createNode("President & CEO", "Margaret C. Whitman", female),
      createNode("President, PayPal", "Scott Thompson", male),
      createNode("President, Ebay Global Marketplaces", "Devin Wenig", male),
      createNode(
        "Senior Vice President Human Resources",
        "Jeffrey S. Skoll",
        male
      ),
      createNode("Senior Vice President Controller", "Steven P. Westly", male),
    ],
    [createNode]
  )

  const edges = useMemo(
    () => [
      createEdge(nodes[0]!, nodes[1]!),
      createEdge(nodes[0]!, nodes[2]!),
      createEdge(nodes[0]!, nodes[3]!),
      createEdge(nodes[0]!, nodes[4]!),
    ],
    [createEdge, nodes]
  )

  useEffect(() => {
    // 创建画布

    console.log(nodes, edges)

    if (nodes.some((node) => !node) || edges.some((edge) => !edge) || !graph)
      return

    graph.resetCells([...nodes, ...edges])
    layout()
    graph.zoomTo(0.8)
    graph.centerContent()
  }, [edges, graph, layout, nodes])

  useEffect(() => {
    const g = new Graph({
      container: document.getElementById("antv-playground")!,
      //   scroller: true,
      interacting: false,
    })

    g.use(new Export())

    setGraph(g)
  }, [])

  return {
    exportPng,
  }
}

export default useAntv
