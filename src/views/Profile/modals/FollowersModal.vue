<template>
  <v-dialog
    :value="value"
    :width="520"
    :height="300"
    scrollable
    @click:outside="$emit('input', false)">
    <v-card>
      <v-card-title>{{ titleByType }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-list v-if="user[type].length">
          <v-list-item
            v-for="person in user[type]"
            :key="person.id"
            two-line
            link
            :to="{ name: 'Profile', params: { id: person.id}}"
            class="px-2">
            <v-list-item-avatar color="primary">
              <v-img
                v-if="person.avatar"
                :src="person.avatar" />
              <span
                v-else
                class="white--text headline">
                {{ person.username[0] }}
              </span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ person.username }} </v-list-item-title>
              <v-list-item-subtitle>{{ person.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list-item v-else>
          {{ emptyTextByType }}
        </v-list-item>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="$emit('input', false)">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FollowersModal',

  props: {
    value: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      required: true,
      validator: (val) => (['following', 'subscribers'].includes(val)),
    },

    user: {
      type: Object,
      required: true,
    },
  },

  computed: {
    titleByType() {
      return this.type === 'following' ? 'Подписан' : 'Подписчики';
    },

    emptyTextByType() {
      return this.type === 'following' ? 'Нет подписок' : 'Нет подписчиков';
    },
  },
};
</script>
