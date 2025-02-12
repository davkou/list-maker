<template>
  <v-list
      dense
      class="list__content"
      :color="list.items.length === 0 ? 'white' : 'grey lighten-4'"
  >
    <draggable
        :list="list.items"
        group="items"
        ghost-class="item--ghost"
        chosen-class="item--chosen"
        drag-class="item--drag"
        :empty-insert-threshold="50"
        :animation="150"
        @start="dragStarted"
        :move="movingStarted"
        @end="endHandler"
        @change="changeHandler"
        :list-id="list.id"
        force-fallback="true"
    >
      <v-list-item
          v-for="item in list.items"
          :key="item.id"
          :ripple="false"
          class="no-transition fill-width pa-0"
      >
        <v-hover v-slot="{ hover }">
          <div
              @click.stop="selectItem(item.id)"
              :class="[
                  'item',
                  'fill-width',
                  'pa-2',
                  'text--unselectable',
                  hover && !dragging ? 'item--hover': ''
                ]"
          >
            {{ item.title }}
          </div>
        </v-hover>
      </v-list-item>
    </draggable>
  </v-list>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ListCardContent',
  components: {
    draggable
  },
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('draggable', ['dragging', 'targetListId', 'movingItemId'])
  },
  methods: {
    ...mapActions('draggable', ['dragStarted', 'dragStopped', 'setTargetListId', 'setMovingItemId']),
    ...mapActions('boards', ['selectItem', 'moveItem']),
    changeHandler (e) {
      if (!Object.prototype.hasOwnProperty.call(e, 'added') && !Object.prototype.hasOwnProperty.call(e, 'moved')) {
        return
      }

      this.moveItem({
        itemId: this.movingItemId,
        targetListId: this.targetListId,
        targetIndex: e[Object.keys(e)[0]].newIndex
      })
    },
    movingStarted (e) {
      this.setTargetListId(e.relatedContext.component.$attrs['list-id'])
      this.setMovingItemId(e.draggedContext.element.id)
    },
    endHandler () {
      this.dragStopped()
    }
  }
}
</script>

<style scoped>
.list__content {
  padding: 1px;
  cursor: pointer;
}

.item {
  background: linear-gradient(to right, var(--v-primary-base) 3px, white 0);
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin: 1px 5px 1px 5px ;
  min-height: 40px;
}

.item--chosen {
  opacity: 1 !important;
}

.item--ghost > div {
  background: #d3d3d3;
  color: #d3d3d3;
  opacity: 25%;
}

.item--hover {
  background: linear-gradient(to right, var(--v-primary-base) 3px, #f1f1f1 0);
}

.item--drag div {
  background: linear-gradient(to right, var(--v-primary-base) 3px, white 0) no-repeat;
  -webkit-transform: rotate(4deg);
  -ms-transform: rotate(4deg);
  transform: rotate(4deg);
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  outline: 1px solid transparent;
  box-shadow:
      0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06)
;
}
</style>
