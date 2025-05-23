package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Comment;
import com.pingfloyd.doy.entities.Complaint;
import com.pingfloyd.doy.entities.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(nativeQuery = true, value = "SELECT * FROM comment WHERE reply_to_id= ?1")
    List<Reply> findCommentsByReplyToID(Long id);

    @Query(nativeQuery = true, value = "SELECT * FROM comment WHERE type= 'COMPLAINT'")
    List<Complaint> findComplaints();

    @Query(nativeQuery = true, value = "SELECT * FROM comment WHERE type= 'COMPLAINT' and user_id = ?1")
    List<Complaint> findComplaintsByCustomerId(Long id);
}
