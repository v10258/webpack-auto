
<template>

<div class="ui-inputtag" v-bind:class="{'read-only': readOnly}">
  <template v-if="defaultTags && defaultTags.length">
    <a v-for="(tag, index) in defaultTags" :key="tag.id" @click="toggleTag(tag, index)" :class="['ui-inputtag-item', tag.checked ? 'selected' : '']">
      {{tag.name}}
    </a>
  </template>
  <div class="ui-inputtag-search">
    <input class="ui-inputtag-new" v-if="!readOnly" :disabled="tagMax" :placeholder="placeholder" type="text" v-model="newTag" v-on:input="autoComplete" v-on:keydown.down="selectDown" v-on:keydown.up="selectUp" v-on:keydown.delete.stop="removeLastTag()" v-on:keydown.enter.188.tab.prevent.stop="addTagActive"/>
    <button class="ui-inputtag-add ion ion-ios-search" @click="autoComplete"></button>
    <div class="ui-inputtag-result" v-if="newTag && active">
      <a v-for="(tag, index) in autoTags" v-bind:class="{ active: index === 0 }" v-on:mouseenter="searchItemEnter" @click="addTagItem(tag)" href="javascript:;">
      {{tag.name}}
      </a>
      <a v-bind:class="{ active: autoTags.length === 0 }" v-if="!isMatch" data-new="true" @click.prevent.stop="addTagItem(newTag, true)" v-on:mouseenter="searchItemEnter" href="javascript:;">
        创建
        <strong>{{newTag}}</strong>
        标签
      </a>
    </div>
  </div>
  <span class="ui-inputtag-mark" v-if="tagMax">
    (最多选择{{limit}}个标签)
  </span>
  <input type="hidden" :name="nameAndId" :id="nameAndId" :value="tagsVal">
</div>

</template>

<script>
  /* eslint-disable */
  const validators = {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url : new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text : new RegExp(/^[a-zA-Z]+$/),
    digits : new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate : new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
  }

  let $ = require('jquery');

  /* eslint-enable */

  export default {
    name: 'InputTag',

    props: {
      hotTags: {
        type: Array,
        default: () => []
      },
      tags: {
        type: Array,
        default: () => []
      },
      onChange: {
        type: Function
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      validate: {
        type: String,
        default: ''
      },
      searchurl: {
        type: String,
        default: ''
      },
      nameAndId: {
        type: String,
        'default':'tags'
      },
      limit: {
        type: Number,
        default: 5
      },
      placeholder: {
        type: String,
        default: '添加标签'
      }
    },

    data () {
      return {
        defaultTags: [],
        currentTags: [],
        newTag: '',
        autoTags: [],
        isMatch: true,
        active: false
      }
    },

    computed: {
      tagMax: function () {
        return this.limit <= this.currentTags.length;
      },
      tagsVal: function(){
        var postTags = this.currentTags.map(function(tag){
          tag = Object.assign({}, tag);
          delete tag.checked;
          return tag;
        })
        return JSON.stringify(postTags);
      }
    },

    created() {
      let self = this;

      self.currentTags = self.tags.slice();

      if (self.tags && self.tags.length) {
        self.defaultTags = self.tags.map(function(tag){
          tag.checked = true;
          return tag;
        })
      } else {
        self.defaultTags = self.hotTags;
      }

      // 点击页面其他位置，关闭标签切换浮层
      $(document).on('click.inputTag', (ev)=>{
        if ($(ev.target).parents('.ui-inputtag').length === 0) {
          self.active = false;
        }
      });
    },

    watch: {
      autoTags: function () {
        let self = this;
        self.isMatch = self.autoTags.some(function(item){
          return item.name === self.newTag;
        })
      },
      newTag: function() {
        if(this.newTag) {
          this.active = true;
        } else {
          this.active = false;
        }
      }
    },

    methods: {
      toggleTag(tag, index) {
        if (tag.checked) {
          this.$set(this.defaultTags[index], 'checked', false);
          this.removeCurrentTagByVal(tag);
        } else if (!this.tagMax) {
          this.$set(this.defaultTags[index], 'checked', true);
          this.addCurrentTag(tag);
        }
        console.log('toogle', this, this.defaultTags, this.currentTags)
      },

      addCurrentTag (tag) {
        tag = Object.assign({}, tag);
        if (this.validateExists(tag) || this.tagMax) return;
        this.currentTags.push(tag);
      },

      removeCurrentTagByVal(tag) {
        let removeIndex = this.currentTags.findIndex(function(val){
          return val.id === tag.id;
        });

        this.currentTags.splice(removeIndex, 1);
      },

      addTagItem (tag, isNew) {
        if (this.validateExists(tag) || this.tagMax) return;

        if (isNew) {
          tag = {
            name: this.newTag,
            checked: true
          }
        } else {
          tag.checked = true;
        }
        tag = Object.assign({}, tag);
        
        this.defaultTags.push(tag);
        this.currentTags.push(tag);
        this.newTag = ''
        this.autoTags = [];
      },
      

      addTagActive () {
        var tag;
        var $active = $(this.$el).find('a.active');
        var activeIndex = $active.index();

        if ($active.data('new')) {
          tag = {
            name: this.newTag
          }
        } else if ($active.length) {
          tag = this.autoTags[activeIndex];
        } else {
          return;
        }

        this.currentTags.push(tag)
        this.newTag = ''
        this.autoTags = [];
      },

      validateExists (tag) {
        return this.currentTags.some(function(tagObj){
          return tagObj.name === tag.name;
        })
      },

      validateIfNeeded (tagValue) {
        if (this.validate === '' || this.validate === undefined) {
          return true
        } else if (Object.keys(validators).indexOf(this.validate) > -1) {
          return validators[this.validate].test(tagValue)
        }
        return true
      },

      removeLastTag () {
        if (this.newTag) { return }
        this.currentTags.pop()
      },

      autoComplete (ev) {
        this.newTag = ev.currentTarget.value;

        $.ajax({
          url: this.searchurl,
          type: 'get',
          data: {
            q: ev.currentTarget.value
          },
          dataType: 'json'
        }).done((result) => {
          if (!result.success) { return }
          this.autoTags = result.data;
          console.log('autoTags', this.autoTags);
        })
      },

      selectTag (item) {
        console.log('item', item)
        this.addNew(item)
        this.autoTags = []
      },

      selectDown () {
        var active = this.$el.querySelector('a.active');

        $(active).next().addClass('active').siblings().removeClass('active');
      },

      selectUp () {
        var active = this.$el.querySelector('a.active');

        $(active).prev().addClass('active').siblings().removeClass('active');
      },

      searchItemEnter (ev) {
        var elem = ev.currentTarget;
        
        elem.classList.add('active');
        $(elem).siblings().removeClass('active');
      }
    }
  }
</script>

<style>
.ui-inputtag {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -5px;

  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: none;
  }
}

.ui-inputtag-addition {
  padding-right: 20px;
}

.ui-inputtag-item {
  display: inline-block;
  background-color: #f6f9fa;
  border-radius: 13px;
  border: 1px solid #c8d6df;
  color: #638421;
  font-size: 13px;
  line-height: 24px;
  padding: 0 20px;
  margin-right: 15px;
  margin-bottom: 15px;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  transition: all .2s;
}

.ui-inputtag-item.selected {
  background: #1e9780;
  color: #fff !important;
}

.ui-inputtag-search {
  display: inline-block;
  position: relative;
  width: 130px;
  height: 26px;
}

.ui-inputtag-new {
  /* width: 150px;
  background: transparent;
  border: 0;
  color: #777;
  font-size: 13px;
  font-weight: 400;
  outline: none;
  padding: 4px;
  padding-left: 0;
  display: block; */
    width: 130px;
    height: 26px;
    padding: 0 4px;
    border: 1px solid #e5e5e5;
    background-color: #f6f6f6;
    font-size: 14px;
    line-height: 24px;
    color: #999;
    /* position: absolute;
    left: 0;
    top: 0; */
    z-index: 2;
    -webkit-transition: all .2s;
    transition: all .2s;
}

.ui-inputtag-add {
  position: absolute;
  top: 8px;
  right: 6px;
  border: none;
  color: #c1c1c1;
  background: transparent;
}

.ui-inputtag.read-only {
  cursor: default;
}

.ui-inputtag-result {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  background: #fff;
  border: 1px solid #e7eaf1;
  border-top: none;
  margin-top: 2px;
}

.ui-inputtag-search a {
  padding: 5px 10px;
  text-decoration: none;
  cursor: pointer;
}

.ui-inputtag-search a.active,
.ui-inputtag-search a:active {
  background: #f4f8fb;
}

.ui-inputtag-mark {
  display: inline-block;
  font-size: 12px;
  line-height: 26px;
  color: #999;
  margin-left: 15px;
}
</style>
