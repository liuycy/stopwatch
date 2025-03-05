<template>
  <overlay position="top" :show="show" @clickoverlay="show = false">
    <tags-binding @tagclick="onTagClick" />
  </overlay>
</template>

<script lang="ts" setup>
import tagsBinding from "../tags/tags-binding.vue";

const records = useRecords();
const tags = useTags();

const record = ref<TimeRecord>();
const show = ref(false);

function onTagClick(tag: Tag) {
  records.bindTag(record.value!, tag);
  tags.binding.add(tag.id);
  show.value = false;
}

onUnload(() => tags.binding.clear());

defineExpose({
  show: (irecord: TimeRecord) => {
    const oldtag = records.unbindTag(irecord);
    if (oldtag) tags.binding.delete(oldtag.id);

    record.value = irecord;
    show.value = true;
  },
});
</script>
