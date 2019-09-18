import { SchemaProperties, Block } from "slate";

const schema: SchemaProperties = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
    nodes: [
      {
        match: [{ type: 'paragraph' }, { type: 'image' }, { type: 'media' }],
      },
    ],
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: { object: 'text' },
        },
      ],
    },
    image: {
      isVoid: true,
      data: {
        src: v => v,
      },
    },
    media: {
      isVoid: true,
      data: {
        src: v => v,
      },
    },
  },

}

export default schema;