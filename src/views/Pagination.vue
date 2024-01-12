<template>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    'name': 'Pagination',
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    computed: {
      pages() {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
    },
    methods: {
      changePage(newPage) {
        if (newPage >= 1 && newPage <= this.totalPages) {
          this.$emit('page-change', newPage);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styling for pagination here */
  </style>