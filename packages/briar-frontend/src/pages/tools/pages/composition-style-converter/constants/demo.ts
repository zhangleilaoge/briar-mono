import { InputType } from '@zhangleilaoge/vue-code-converter';

export const DEMO: Record<InputType, string> = {
  [InputType.CompositionApi]: '',
  [InputType.OptionStyle]: `<template>
    <div class="sampleClass">
      {{ strData }}
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Comp1 from '@/components/Comp1.vue'
  
  export default Vue.extend({
    name: 'SampleComp',
    components: {
      Comp1,
    },
    props: {
      prop1: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        strData: 'str',
        numData: 10,
        boolData: true,
        objData: { a: 1 },
        firstName: 'firstName',
        lastName: 'lastName',
      }
    },
    computed: {
      ...mapGetters('module1', ['getter1']),
      ...mapState('module2', ['state1']),
      doubledNum(): number {
        return this.numData * 2
      },
      fullName: {
        get(): string {
          return \`\${this.firstName} \${this.lastName}\`
        },
        set(val: string) {
          const [first, last] = val.split(' ')
          this.firstName = first
          this.lastName = last
        },
      },
    },
    watch: {
      numData(curr, prev) {
        console.log(\`num: \${prev} -> \${curr}\`)
      },
      '$route.params'() {
        console.log('routeParams changed')
      },
      prop1: {
        handler(val) {
          this.objData = val
        },
        immediate: true,
        deep: true,
      },
    },
    async created(){
      console.log('async created')
      await this.asyncMethod()
    },
    mounted() {
      console.log('mounted')
      this.$nextTick(()=> {
        console.log(this.prop1)
      })
      this.strData = this.$store.state.aaa
    },
    destroyed(){
      console.log('destroyed')
    },
    methods: {
      ...mapActions('module3', ['action1']),
      increment():number {
        return this.numData++
      },
      async asyncMethod(args) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.action1(args)
      },
    },
    customMethod() {
      console.log('custom')
    },
    customBlock: {
      rules: ['aaa']
    },
  })
  </script>
  
  <style lang="scss" scoped>
  .sampleClass {
    display: flex;
  }
  </style>
  `,

  [InputType.DecorateStyle]: `<template>
  <div class="sampleClass">
    {{ strData }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import OtherComponent from './OtherComponent.vue'

@Component({
  components: {
    OtherComponent
  },
})
export default class SomeComponent extends Vue {
  // Declared as component data
  count:number = 0
  firstName = ''
  lastName = ''

  // vue-property-decorator
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 10 }) readonly propB!: number
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined


  @Prop()
  value: string
  @Prop({ default: '#f00', required: false })
  color: string

  @Watch('value', { immediate: true })
  onValueChange(val, oldVal) {
    console.log(val)
  }

  // Declared as component method
  async increment():number {
    this.count++
  }

  // Declared as computed property getter
  get double():number{
    return count * 2
  }
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  // Declared as computed property setter
  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }

  // Declare mounted lifecycle hook
  mounted() {
    console.log('mounted')
  }

}
</script>

<style lang="scss" scoped>
.sampleClass {
  display: flex;
}
</style>

  `,
};
